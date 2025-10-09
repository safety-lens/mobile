// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginReactNative = require('eslint-plugin-react-native');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      'react-native': eslintPluginReactNative,
    },
    rules: {
      'react-native/no-unused-styles': 'warn',
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
