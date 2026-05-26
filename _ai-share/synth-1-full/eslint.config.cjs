// ESLint 9 flat config (Next 16). Relaxes React Compiler hook rules until providers are refactored.
/** @type {import('eslint').Linter.Config[]} */
const next = require('eslint-config-next/core-web-vitals');

module.exports = [
  ...next,
  {
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];
