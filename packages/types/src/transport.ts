import { DsnLike } from './dsn';
import { Event } from './event';
import { Response } from './response';

/** Transport used sending data to Beidou */
export interface Transport {
  /**
   * Sends the body to the Store endpoint in Beidou.
   *
   * @param body String body that should be sent to Beidou.
   */
  sendEvent(event: Event): PromiseLike<Response>;

  /**
   * Call this function to wait until all pending requests have been sent.
   *
   * @param timeout Number time in ms to wait until the buffer is drained.
   */
  close(timeout?: number): PromiseLike<boolean>;
}

/** JSDoc */
export type TransportClass<T extends Transport> = new (options: TransportOptions) => T;

/** JSDoc */
export interface TransportOptions {
  /** Beidou DSN */
  dsn: DsnLike;
  /** Define custom headers */
  headers?: { [key: string]: string };
  /** Set a HTTP proxy that should be used for outbound requests. */
  httpProxy?: string;
  /** Set a HTTPS proxy that should be used for outbound requests. */
  httpsProxy?: string;
  /** HTTPS proxy certificates path */
  caCerts?: string;
  /** Fetch API init parameters */
  fetchParameters?: { [key: string]: string };
}
