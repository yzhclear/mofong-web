module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  transformIgnorePatterns: [
    // all exceptions must be first line
    '/node_modules/(?!lodash-es)',
  ],
};
