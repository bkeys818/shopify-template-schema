# Shopify Template Schema

> A tool for converting Shopify schemas into a JSON schema for templates.

[![Version][version-image]][version-link]
[![Downloads Stats][npm-downloads]][npm-link]
[![Run test][test-status]][test-link]

## Installation

Yarn:

```sh
yarn add shopify-template-schema
```

## Usage

Shopify template schema will only create a schema for your templates. It won't valid them.

If your using [Visual Studio Code](https://code.visualstudio.com) we recommend using the [json schema setting](https://code.visualstudio.com/Docs/languages/json#_json-schemas-and-settings), like this:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["templates/*.json"],
      "url": "./template.schema.json"
    }
  ]
}
```

## Running from command line

You can run `shopify-template-schema` directly from the CLI with a variety of options.

Here's how you would run it if the current directory isn't the a shopify project.

```sh
shopify-template-schema path/to/shopify-project
```

To view all options run:

```sh
shopify-template-schema -h
```

<!-- Markdown link & img dfn's -->

[version-image]: https://img.shields.io/github/package-json/v/bkeys818/shopify-template-schema/v0.1.0?label=version
[version-link]: https://github.com/bkeys818/shopify-template-schema/releases/tag/v0.1.0
[npm-downloads]: https://img.shields.io/npm/dm/shopify-template-schema.svg
[npm-link]: https://www.npmjs.com/package/shopify-template-schema/v/0.1.0
[test-status]: https://github.com/bkeys818/shopify-template-schema/actions/workflows/run-tests.yaml/badge.svg?branch=v0.1.0
[test-link]: https://github.com/bkeys818/shopify-template-schema/actions/workflows/run-tests.yaml
