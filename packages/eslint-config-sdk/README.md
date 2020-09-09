<p align="center">
  <a href="https://beidou.io" target="_blank" align="center">
    <img src="https://beidou-brand.storage.googleapis.com/beidou-logo-black.png" width="280">
  </a>
  <br />
</p>

# Official Beidou SDK eslint config

[![npm version](https://img.shields.io/npm/v/@beidou-internal/eslint-config-sdk.svg)](https://www.npmjs.com/package/@beidou-internal/eslint-config-sdk)
[![npm dm](https://img.shields.io/npm/dm/@beidou-internal/eslint-config-sdk.svg)](https://www.npmjs.com/package/@beidou-internal/eslint-config-sdk)
[![npm dt](https://img.shields.io/npm/dt/@beidou-internal/eslint-config-sdk.svg)](https://www.npmjs.com/package/@beidou-internal/eslint-config-sdk)
[![typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](http://getbeidou.github.io/beidou-javascript/)

## Links

- [Official SDK Docs](https://docs.beidou.io/quickstart/)
- [TypeDoc](http://getbeidou.github.io/beidou-javascript/)

## General

Install with `yarn add -D @beidou-internal/eslint-config-sdk`

## Configuration

Use `@beidou-internal` for base rules. Make sure to specify your tsconfig under `parserOptions.project` so that you can
correctly use the typescript rules. This configuration comes with

```json
{
  "extends": ["@beidou-internal/sdk"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.d.ts"],
      "parserOptions": {
        "project": "./tsconfig.json"
      }
    }
  ]
}
```
