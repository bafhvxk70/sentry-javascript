export {
  Breadcrumb,
  Request,
  SdkInfo,
  Event,
  Exception,
  Response,
  Severity,
  StackFrame,
  Stacktrace,
  Status,
  Thread,
  User,
} from '@beidou/types';

export {
  addGlobalEventProcessor,
  addBreadcrumb,
  captureException,
  captureEvent,
  captureMessage,
  configureScope,
  getHubFromCarrier,
  getCurrentHub,
  Hub,
  Scope,
  setContext,
  setExtra,
  setExtras,
  setTag,
  setTags,
  setUser,
  Transports,
  withScope,
} from '@beidou/browser';

export { BrowserOptions } from '@beidou/browser';
export { BrowserClient, ReportDialogOptions } from '@beidou/browser';
export {
  defaultIntegrations,
  forceLoad,
  init,
  lastEventId,
  onLoad,
  showReportDialog,
  flush,
  close,
  wrap,
} from '@beidou/browser';
export { SDK_NAME, SDK_VERSION } from '@beidou/browser';

import { Integrations as BrowserIntegrations } from '@beidou/browser';
import { getGlobalObject } from '@beidou/utils';

import { BrowserTracing } from './browser';
import { addExtensionMethods } from './hubextensions';

export { Span, TRACEPARENT_REGEXP } from './span';

let windowIntegrations = {};

// This block is needed to add compatibility with the integrations packages when used with a CDN
const _window = getGlobalObject<Window>();
if (_window.Beidou && _window.Beidou.Integrations) {
  windowIntegrations = _window.Beidou.Integrations;
}

const INTEGRATIONS = {
  ...windowIntegrations,
  ...BrowserIntegrations,
  BrowserTracing,
};

export { INTEGRATIONS as Integrations };

// We are patching the global object with our hub extension methods
addExtensionMethods();

export { addExtensionMethods };
