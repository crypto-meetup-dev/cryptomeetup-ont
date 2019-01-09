module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-mixed-operators': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'max-len': 'off',
    'no-alert': 'off',
    'comma-dangle': 'off',
    'no-unused-expressions': 'off',
    semi: 'off',
    'arrow-parens': 'off',
    'arrow-spacing': 'off',
    'no-unused-vars': 'off',
    'import/no-extraneous-dependencies': 'off',
    'space-before-function-paren': 'off',
    'no-trailing-spaces': 'off',
    'linebreak-style': 'off',
    'consistent-return': 'off',
    'key-spacing': 'off',
    'no-irregular-whitespace': 'off',
    'object-curly-spacing': 'off',
    'object-curly-newline': 'off',
    'import/first': 'off',
    'import/extensions': 'off',
    'prefer-destructuring': 'off',
    'radix': 'off',
    'prefer-template': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};