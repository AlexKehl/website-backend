module.exports = {
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '\\.test.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['@swc/jest'],
  },
  setupFiles: ['./jest.setup.ts'],
};
