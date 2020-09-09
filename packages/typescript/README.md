<p align="center">
  <a href="https://beidou.io" target="_blank" align="center">
    <img src="https://beidou-brand.storage.googleapis.com/beidou-logo-black.png" width="280">
  </a>
  <br />
</p>

# Beidou TypeScript Configuration

[![npm version](https://img.shields.io/npm/v/@beidou-internal/typescript.svg)](https://www.npmjs.com/package/@beidou-internal/typescript)
[![npm dm](https://img.shields.io/npm/dm/@beidou-internal/typescript.svg)](https://www.npmjs.com/package/@beidou-internal/typescript)
[![npm dt](https://img.shields.io/npm/dt/@beidou-internal/typescript.svg)](https://www.npmjs.com/package/@beidou-internal/typescript)

[![typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](http://getbeidou.github.io/beidou-javascript/)

## Links

- [Official SDK Docs](https://docs.beidou.io/quickstart/)
- [TypeDoc](http://getbeidou.github.io/beidou-javascript/)

## General

Shared typescript configuration used at Beidou.

## Installation

```sh
# With Yarn:
yarn add --dev @beidou-internal/typescript

# With NPM:
npm install --save-dev @beidou-internal/typescript
```

## Usage

Add the following config files to your project's root directory:

**tslint.json**:

```json
{
  "extends": "@beidou-internal/typescript/tslint"
}
```

**tsconfig.json**:

```json
{
  "extends": "./node_modules/@beidou-internal/typescript/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "rootDir": "src",
    "outDir": "dist"
  }
}
```
