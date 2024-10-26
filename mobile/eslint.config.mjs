/* eslint-disable import/no-anonymous-default-export */
import shopifyEslintPlugin from '@shopify/eslint-plugin';

export default [
  ...shopifyEslintPlugin.configs.typescript,
  ...shopifyEslintPlugin.configs.react,
  ...shopifyEslintPlugin.configs.prettier,
  ...shopifyEslintPlugin.configs['typescript-type-checking'],

  {
    ignores: ['**/node_modules', '**/dist'],
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
  },
];
