<p align="center">
  <a href="https://beidou.io" target="_blank" align="center">
    <img src="https://beidou-brand.storage.googleapis.com/beidou-logo-black.png" width="280">
  </a>
  <br />
</p>

# Official Beidou SDK for Browsers

[![Sauce Test Status](https://saucelabs.com/buildstatus/beidouio)](https://saucelabs.com/u/beidouio)
[![npm version](https://img.shields.io/npm/v/@beidou/browser.svg)](https://www.npmjs.com/package/@beidou/browser)
[![npm dm](https://img.shields.io/npm/dm/@beidou/browser.svg)](https://www.npmjs.com/package/@beidou/browser)
[![npm dt](https://img.shields.io/npm/dt/@beidou/browser.svg)](https://www.npmjs.com/package/@beidou/browser)
[![typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](http://getbeidou.github.io/beidou-javascript/)

## Links

- [Official SDK Docs](https://docs.beidou.io/quickstart/)
- [TypeDoc](http://getbeidou.github.io/beidou-javascript/)

## Usage

To use this SDK, call `Beidou.init(options)` as early as possible after loading the page. This will initialize the SDK
and hook into the environment. Note that you can turn off almost all side effects using the respective options.

```javascript
import * as Beidou from '@beidou/browser';

Beidou.init({
  dsn: '__DSN__',
  // ...
});
```

To set context information or send manual events, use the exported functions of `@beidou/browser`. Note that these
functions will not perform any action before you have called `Beidou.init()`:

```javascript
import * as Beidou from '@beidou/browser';

// Set user information, as well as tags and further extras
Beidou.configureScope(scope => {
  scope.setExtra('battery', 0.7);
  scope.setTag('user_mode', 'admin');
  scope.setUser({ id: '4711' });
  // scope.clear();
});

// Add a breadcrumb for future events
Beidou.addBreadcrumb({
  message: 'My Breadcrumb',
  // ...
});

// Capture exceptions, messages or manual events
Beidou.captureMessage('Hello, world!');
Beidou.captureException(new Error('Good bye'));
Beidou.captureEvent({
  message: 'Manual',
  stacktrace: [
    // ...
  ],
});
```
