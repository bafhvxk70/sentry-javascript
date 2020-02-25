import { Event, EventHint, EventProcessor, Hub, Integration } from '@sentry/types';
import { isPlainObject, isRegExp, Memo } from '@sentry/utils';

/** JSDoc */
interface ScrubDataOptions {
  sanitizeKeys: Array<string | RegExp>;
}

/** JSDoc */
export class ScrubData implements Integration {
  /**
   * @inheritDoc
   */
  public name: string = ScrubData.id;

  /**
   * @inheritDoc
   */
  public static id: string = 'ScrubData';

  /** JSDoc */
  private readonly _options: ScrubDataOptions;
  private readonly _sanitizeMask: string;
  private _lazySanitizeRegExp?: RegExp;

  /**
   * @inheritDoc
   */
  public constructor(options: ScrubDataOptions) {
    this._options = {
      sanitizeKeys: [],
      ...options,
    };
    this._sanitizeMask = '********';
  }

  /**
   * @inheritDoc
   */
  public setupOnce(addGlobalEventProcessor: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void {
    addGlobalEventProcessor((event: Event, _hint?: EventHint) => {
      const self = getCurrentHub().getIntegration(ScrubData);
      if (self) {
        return self.process(event);
      }
      return event;
    });
  }

  /** JSDoc */
  public process(event: Event): Event {
    if (this._options.sanitizeKeys.length === 0) {
      // nothing to sanitize
      return event;
    }

    return this._sanitize(event) as Event;
  }

  /**
   * lazily generate regexp
   */
  private _sanitizeRegExp(): RegExp {
    if (this._lazySanitizeRegExp) {
      return this._lazySanitizeRegExp;
    }

    const sources = this._options.sanitizeKeys.reduce(
      (acc, key) => {
        if (typeof key === 'string') {
          // escape string value
          // see also: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
          acc.push(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        } else if (isRegExp(key)) {
          acc.push(key.source);
        }
        return acc;
      },
      [] as string[],
    );

    return (this._lazySanitizeRegExp = RegExp(sources.join('|'), 'i'));
  }

  /**
   * sanitize event data recursively
   */
  private _sanitize(input: unknown, memo: Memo = new Memo()): unknown {
    const inputIsArray = Array.isArray(input);
    const inputIsPlainObject = isPlainObject(input);

    if (!inputIsArray && !inputIsPlainObject) {
      return input;
    }

    // Avoid circular references
    if (memo.memoize(input)) {
      return input;
    }

    let sanitizedValue;
    if (inputIsArray) {
      sanitizedValue = (input as any[]).map(value => this._sanitize(value, memo));
    } else if (inputIsPlainObject) {
      const inputVal = input as { [key: string]: unknown };
      sanitizedValue = Object.keys(inputVal).reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = this._sanitizeRegExp().test(key) ? this._sanitizeMask : this._sanitize(inputVal[key], memo);
        return acc;
      }, {});
    }

    memo.unmemoize(input);

    return sanitizedValue;
  }
}