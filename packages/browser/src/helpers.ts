import { API, captureException, withScope } from '@beidou/core';
import { DsnLike, Event as BeidouEvent, Mechanism, Scope, WrappedFunction } from '@beidou/types';
import { addExceptionMechanism, addExceptionTypeValue, logger } from '@beidou/utils';

let ignoreOnError: number = 0;

/**
 * @hidden
 */
export function shouldIgnoreOnError(): boolean {
  return ignoreOnError > 0;
}

/**
 * @hidden
 */
export function ignoreNextOnError(): void {
  // onerror should trigger before setTimeout
  ignoreOnError += 1;
  setTimeout(() => {
    ignoreOnError -= 1;
  });
}

/**
 * Instruments the given function and sends an event to Beidou every time the
 * function throws an exception.
 *
 * @param fn A function to wrap.
 * @returns The wrapped function.
 * @hidden
 */
export function wrap(
  fn: WrappedFunction,
  options: {
    mechanism?: Mechanism;
  } = {},
  before?: WrappedFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (typeof fn !== 'function') {
    return fn;
  }

  try {
    // We don't wanna wrap it twice
    if (fn.__beidou__) {
      return fn;
    }

    // If this has already been wrapped in the past, return that wrapped function
    if (fn.__beidou_wrapped__) {
      return fn.__beidou_wrapped__;
    }
  } catch (e) {
    // Just accessing custom props in some Selenium environments
    // can cause a "Permission denied" exception (see raven-js#495).
    // Bail on wrapping and return the function as-is (defers to window.onerror).
    return fn;
  }

  /* eslint-disable prefer-rest-params */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const beidouWrapped: WrappedFunction = function (this: any): void {
    const args = Array.prototype.slice.call(arguments);

    try {
      if (before && typeof before === 'function') {
        before.apply(this, arguments);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      const wrappedArguments = args.map((arg: any) => wrap(arg, options));

      if (fn.handleEvent) {
        // Attempt to invoke user-land function
        // NOTE: If you are a Beidou user, and you are seeing this stack frame, it
        //       means the beidou.javascript SDK caught an error invoking your application code. This
        //       is expected behavior and NOT indicative of a bug with beidou.javascript.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return fn.handleEvent.apply(this, wrappedArguments);
      }
      // Attempt to invoke user-land function
      // NOTE: If you are a Beidou user, and you are seeing this stack frame, it
      //       means the beidou.javascript SDK caught an error invoking your application code. This
      //       is expected behavior and NOT indicative of a bug with beidou.javascript.
      return fn.apply(this, wrappedArguments);
    } catch (ex) {
      ignoreNextOnError();

      withScope((scope: Scope) => {
        scope.addEventProcessor((event: BeidouEvent) => {
          const processedEvent = { ...event };

          if (options.mechanism) {
            addExceptionTypeValue(processedEvent, undefined, undefined);
            addExceptionMechanism(processedEvent, options.mechanism);
          }

          processedEvent.extra = {
            ...processedEvent.extra,
            arguments: args,
          };

          return processedEvent;
        });

        captureException(ex);
      });

      throw ex;
    }
  };
  /* eslint-enable prefer-rest-params */

  // Accessing some objects may throw
  // ref: https://github.com/getbeidou/beidou-javascript/issues/1168
  try {
    for (const property in fn) {
      if (Object.prototype.hasOwnProperty.call(fn, property)) {
        beidouWrapped[property] = fn[property];
      }
    }
  } catch (_oO) { } // eslint-disable-line no-empty

  fn.prototype = fn.prototype || {};
  beidouWrapped.prototype = fn.prototype;

  Object.defineProperty(fn, '__beidou_wrapped__', {
    enumerable: false,
    value: beidouWrapped,
  });

  // Signal that this function has been wrapped/filled already
  // for both debugging and to prevent it to being wrapped/filled twice
  Object.defineProperties(beidouWrapped, {
    __beidou__: {
      enumerable: false,
      value: true,
    },
    __beidou_original__: {
      enumerable: false,
      value: fn,
    },
  });

  // Restore original function name (not all browsers allow that)
  try {
    const descriptor = Object.getOwnPropertyDescriptor(beidouWrapped, 'name') as PropertyDescriptor;
    if (descriptor.configurable) {
      Object.defineProperty(beidouWrapped, 'name', {
        get(): string {
          return fn.name;
        },
      });
    }
    // eslint-disable-next-line no-empty
  } catch (_oO) { }

  return beidouWrapped;
}

/**
 * All properties the report dialog supports
 */
export interface ReportDialogOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  eventId?: string;
  dsn?: DsnLike;
  user?: {
    email?: string;
    name?: string;
  };
  lang?: string;
  title?: string;
  subtitle?: string;
  subtitle2?: string;
  labelName?: string;
  labelEmail?: string;
  labelComments?: string;
  labelClose?: string;
  labelSubmit?: string;
  errorGeneric?: string;
  errorFormEntry?: string;
  successMessage?: string;
  /** Callback after reportDialog showed up */
  onLoad?(): void;
}

/**
 * Injects the Report Dialog script
 * @hidden
 */
export function injectReportDialog(options: ReportDialogOptions = {}): void {
  if (!options.eventId) {
    logger.error(`Missing eventId option in showReportDialog call`);
    return;
  }
  if (!options.dsn) {
    logger.error(`Missing dsn option in showReportDialog call`);
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = new API(options.dsn).getReportDialogEndpoint(options);

  if (options.onLoad) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    script.onload = options.onLoad;
  }

  (document.head || document.body).appendChild(script);
}
