module.exports = {
  env: {
    'jest/globals': true,
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: ['plugin:jest/recommended', 'eslint:recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {},
};
