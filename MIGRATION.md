# Migration

## 2.0.1 → 3.0.0

Minimum required version of Node.js to use markdown-lint is now 16.0.0.

`.markdownlintrc.js` has been renamed to
[.markdownlintrc.cjs](./.markdownlintrc.cjs).

«cjs» file extension should be used now when you include external config using
`-c` or `--config` options.

It’s no longer necessary to use `require()` when including plugins in
`remark.plugins` config section.

Options `listItemIndent` and `fences` have been removed from
`remark.stringifySettings` section as they duplicated values set by default in
`remark-stringify`.

## 1.2.1 → 2.0.0

No post-upgrade action is required if you use a linter without a custom
configuration file.

If you use a custom configuration file, then you should check
[changes](https://github.com/funbox/markdown-lint/commit/e6e3a3fe723f7c7529e7b651639f85ebaa061f85)
made to [.markdownlintrc.js](.markdownlintrc.js) in order to avoid an unexpected
behavior.
