module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'prefer-const': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {},
};
