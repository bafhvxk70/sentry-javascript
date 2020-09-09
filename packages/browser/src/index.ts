export * from './exports';

import { Integrations as CoreIntegrations } from '@beidou/core';
import { getGlobalObject } from '@beidou/utils';

import * as BrowserIntegrations from './integrations';
import * as Transports from './transports';

let windowIntegrations = {};

// This block is needed to add compatibility with the integrations packages when used with a CDN
const _window = getGlobalObject<Window>();
if (_window.Beidou && _window.Beidou.Integrations) {
  windowIntegrations = _window.Beidou.Integrations;
}

const INTEGRATIONS = {
  ...windowIntegrations,
  ...CoreIntegrations,
  ...BrowserIntegrations,
};

export { INTEGRATIONS as Integrations, Transports };
