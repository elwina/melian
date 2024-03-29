module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'no-unused-vars': 'warn',
    'prettier/prettier': 'off',
    'operator-assignment': 'off',
    'no-plusplus': 'off',
    'default-case': 'off',
    'object-shorthand': 'off',
    camelcase: 'off',
    'no-continue': 'off',
    'no-shadow': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'import/prefer-default-export': 'off',
    'no-await-in-loop': 'off',
    'no-useless-return': 'off',
    'no-else-return': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'prefer-destructuring': 'off',
    'no-empty': 'off',
    'react/require-default-props': 'off',
    'no-nested-ternary': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
