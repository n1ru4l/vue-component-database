module.exports = {
  'parser': `babel-eslint`,
  'env': {
    'jest': true
  },
  'parserOptions': {
    'sourceType': `script`
  },
  'root': true,
  'extends': `airbnb-base`,
  'rules': {
    'semi': [`error`, `never`],
    'quotes': [`error`, `backtick`],
    'array-bracket-spacing': [`error`, `always`],
    'import/sort-import': `off`,
    'graphql/template-strings': [`error`, {
        'env': `literal`,
        'schemaJson': require(`./graphql.schema.json`)
      }
    ],
    'comma-dangle': [`error`, {
      'arrays': `only-multiline`,
      'objects': `only-multiline`,
      'imports': `only-multiline`,
      'exports': `only-multiline`,
      'functions': `never`,
    }],
    'import/first': `off`,
  },
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': `webpack.config.js`
      }
    }
  },
  plugins: [
    `graphql`
  ]
}
