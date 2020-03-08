module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    'jest': true,
  },
  rules: {
    "import/no-unresolved": [
      2,
      { "caseSensitive": false }
    ],
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    'max-len': 'off',
    'no-console': 'off',
  },
  globals: {
    fetch: false
  }
}