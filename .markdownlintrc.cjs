module.exports = {
  prettier: {
    parser: 'markdown',
    printWidth: 80,
    proseWrap: 'always',
    singleQuote: true,
    arrowParens: 'avoid',
    embeddedLanguageFormatting: 'off',
  },
  remark: {
    plugins: [
    	'remark-preset-lint-markdown-style-guide',
      ['remark-lint-list-item-indent', 'space'],
      ['remark-lint-list-item-spacing', { checkBlanks: true }],
      ['remark-lint-ordered-list-marker-value', 'ordered'],
      ['remark-lint-emphasis-marker', 'consistent'],
    ],

    stringifySettings: {
      bullet: '-',
    }
  },
  typograf: {
    locale: ['ru', 'en-US'],
    enableRules: [],
    disableRules: [
      // these rules must be disabled to prevent incorrect typograf—markdown integration
      'common/space/delTrailingBlanks',
      'common/space/trimLeft',
      'common/space/trimRight'
    ],
    rulesSettings: []
  }
};
