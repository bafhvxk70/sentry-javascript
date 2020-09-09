<p align="center">
  <a href="https://beidou.io" target="_blank" align="center">
    <img src="https://beidou-brand.storage.googleapis.com/beidou-logo-black.png" width="280">
  </a>
  <br />
</p>

# Beidou JavaScript SDK Minimal

[![npm version](https://img.shields.io/npm/v/@beidou/minimal.svg)](https://www.npmjs.com/package/@beidou/minimal)
[![npm dm](https://img.shields.io/npm/dm/@beidou/minimal.svg)](https://www.npmjs.com/package/@beidou/minimal)
[![npm dt](https://img.shields.io/npm/dt/@beidou/minimal.svg)](https://www.npmjs.com/package/@beidou/minimal)
[![typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](http://getbeidou.github.io/beidou-javascript/)

## Links

- [Official SDK Docs](https://docs.beidou.io/quickstart/)
- [TypeDoc](http://getbeidou.github.io/beidou-javascript/)

## General

A minimal Beidou SDK that uses a configured client when embedded into an application. It allows library authors add
support for a Beidou SDK without having to bundle the entire SDK or being dependent on a specific platform. If the user
is using Beidou in their application and your library uses `@beidou/minimal`, the user receives all
breadcrumbs/messages/events you added to your libraries codebase.

## Usage

To use the minimal, you do not have to initialize an SDK. This should be handled by the user of your library. Instead,
directly use the exported functions of `@beidou/minimal` to add breadcrumbs or capture events:

```javascript
import * as Beidou from '@beidou/minimal';

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

Note that while strictly possible, it is discouraged to interfere with the event context. If for some reason your
library needs to inject context information, beware that this might override the user's context values:

```javascript
// Set user information, as well as tags and further extras
Beidou.configureScope(scope => {
  scope.setExtra('battery', 0.7);
  scope.setTag('user_mode', 'admin');
  scope.setUser({ id: '4711' });
  // scope.clear();
});
```
