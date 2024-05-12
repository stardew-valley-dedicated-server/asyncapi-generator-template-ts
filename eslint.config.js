/* eslint-disable @typescript-eslint/no-var-requires */
const react = require('eslint-plugin-react');
const stylistic = require('@stylistic/eslint-plugin');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const globals = require('globals');

module.exports = [
  {
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      react,
      '@stylistic': stylistic,
      '@typescript-eslint': ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          ecmaFeatures: { modules: true },
          ecmaVersion: 'latest',
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      ...ts.configs['eslint-recommended'].rules,
      ...ts.configs['recommended'].rules,
      'no-unused-vars': 'off',
      'no-undef': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/semi': 'error',
    },
    ignores: [
      '.output/**/*.*',
      '__transpiled/**/*.*',
    ],
  },
];
