import { API } from '@beidou/core';
import { Event, Response, Transport, TransportOptions } from '@beidou/types';
import { PromiseBuffer, BeidouError } from '@beidou/utils';

/** Base Transport class implementation */
export abstract class BaseTransport implements Transport {
  /**
   * @deprecated
   */
  public url: string;

  /** Helper to get Beidou API endpoints. */
  protected readonly _api: API;

  /** A simple buffer holding all requests. */
  protected readonly _buffer: PromiseBuffer<Response> = new PromiseBuffer(30);

  public constructor(public options: TransportOptions) {
    this._api = new API(this.options.dsn);
    // eslint-disable-next-line deprecation/deprecation
    this.url = this._api.getStoreEndpointWithUrlEncodedAuth();
  }

  /**
   * @inheritDoc
   */
  public sendEvent(_: Event): PromiseLike<Response> {
    throw new BeidouError('Transport Class has to implement `sendEvent` method');
  }

  /**
   * @inheritDoc
   */
  public close(timeout?: number): PromiseLike<boolean> {
    return this._buffer.drain(timeout);
  }
}
