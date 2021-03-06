import { DsnLike } from '@beidou/types';
import { Dsn, urlEncode } from '@beidou/utils';

const SENTRY_API_VERSION = '7';

/** Helper class to provide urls to different Beidou endpoints. */
export class API {
  /** The internally used Dsn object. */
  private readonly _dsnObject: Dsn;
  /** Create a new instance of API */
  public constructor(public dsn: DsnLike) {
    this._dsnObject = new Dsn(dsn);
  }

  /** Returns the Dsn object. */
  public getDsn(): Dsn {
    return this._dsnObject;
  }

  /** Returns the prefix to construct Beidou ingestion API endpoints. */
  public getBaseApiEndpoint(): string {
    const dsn = this._dsnObject;
    const protocol = dsn.protocol ? `${dsn.protocol}:` : '';
    const port = dsn.port ? `:${dsn.port}` : '';
    return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ''}/api/`;
  }

  /** Returns the store endpoint URL. */
  public getStoreEndpoint(): string {
    return this._getIngestEndpoint('store');
  }

  /**
   * Returns the store endpoint URL with auth in the query string.
   *
   * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
   */
  public getStoreEndpointWithUrlEncodedAuth(): string {
    return `${this.getStoreEndpoint()}?${this._encodedAuth()}`;
  }

  /**
   * Returns the envelope endpoint URL with auth in the query string.
   *
   * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
   */
  public getEnvelopeEndpointWithUrlEncodedAuth(): string {
    return `${this._getEnvelopeEndpoint()}?${this._encodedAuth()}`;
  }

  /** Returns only the path component for the store endpoint. */
  public getStoreEndpointPath(): string {
    const dsn = this._dsnObject;
    return `${dsn.path ? `/${dsn.path}` : ''}/api/${dsn.projectId}/store/`;
  }

  /**
   * Returns an object that can be used in request headers.
   * This is needed for node and the old /store endpoint in beidou
   */
  public getRequestHeaders(clientName: string, clientVersion: string): { [key: string]: string } {
    const dsn = this._dsnObject;
    const header = [`Beidou beidou_version=${SENTRY_API_VERSION}`];
    header.push(`beidou_client=${clientName}/${clientVersion}`);
    header.push(`beidou_key=${dsn.user}`);
    if (dsn.pass) {
      header.push(`beidou_secret=${dsn.pass}`);
    }
    return {
      'Content-Type': 'application/json',
      'X-Beidou-Auth': header.join(', '),
    };
  }

  /** Returns the url to the report dialog endpoint. */
  public getReportDialogEndpoint(
    dialogOptions: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
      user?: { name?: string; email?: string };
    } = {},
  ): string {
    const dsn = this._dsnObject;
    const endpoint = `${this.getBaseApiEndpoint()}embed/error-page/`;

    const encodedOptions = [];
    encodedOptions.push(`dsn=${dsn.toString()}`);
    for (const key in dialogOptions) {
      if (key === 'user') {
        if (!dialogOptions.user) {
          continue;
        }
        if (dialogOptions.user.name) {
          encodedOptions.push(`name=${encodeURIComponent(dialogOptions.user.name)}`);
        }
        if (dialogOptions.user.email) {
          encodedOptions.push(`email=${encodeURIComponent(dialogOptions.user.email)}`);
        }
      } else {
        encodedOptions.push(`${encodeURIComponent(key)}=${encodeURIComponent(dialogOptions[key] as string)}`);
      }
    }
    if (encodedOptions.length) {
      return `${endpoint}?${encodedOptions.join('&')}`;
    }

    return endpoint;
  }

  /** Returns the envelope endpoint URL. */
  private _getEnvelopeEndpoint(): string {
    return this._getIngestEndpoint('envelope');
  }

  /** Returns the ingest API endpoint for target. */
  private _getIngestEndpoint(target: 'store' | 'envelope'): string {
    const base = this.getBaseApiEndpoint();
    const dsn = this._dsnObject;
    return `${base}${dsn.projectId}/${target}/`;
  }

  /** Returns a URL-encoded string with auth config suitable for a query string. */
  private _encodedAuth(): string {
    const dsn = this._dsnObject;
    const auth = {
      // We send only the minimum set of required information. See
      // https://github.com/getbeidou/beidou-javascript/issues/2572.
      beidou_key: dsn.user,
      beidou_version: SENTRY_API_VERSION,
    };
    return urlEncode(auth);
  }
}
