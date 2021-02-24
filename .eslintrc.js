module.exports = {
  extends: [
    'standard',
    'plugin:unicorn/recommended',
    'plugin:node/recommended',
  ],
  ignorePatterns: ['node_modules'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: false,
  },
  plugins: ['security'],
  overrides: [
    {
      files: ['*.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      plugins: ['@graphql-eslint'],
    },
  ],
  rules: {
    'space-before-function-paren': 0,
    'no-console': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'node/exports-style': ['error', 'module.exports'],
    'node/file-extension-in-import': ['error', 'always'],
    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/console': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always'],
    'node/prefer-global/url-search-params': ['error', 'always'],
    'node/prefer-global/url': ['error', 'always'],
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error',
    'node/no-unpublished-require': [
      'error',
      {
        allowModules: ['tape'],
      },
    ],
  },
}
