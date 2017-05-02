'use strict'

const path = require(`path`)
const { ProvidePlugin } = require(`webpack`)

module.exports = {
  entry: {
    main: path.join(__dirname, `src`, `frontend`, `main.js`),
  },
  output: {
      filename: path.join(`build`, `[name].bundle.js`)
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: `vue-loader`,
      },
      {
        test: /\.css$/,
        use: [`style-loader`, `css-loader`],
      }
    ],
  },
  resolve: {
    alias: {
      vue: `vue/dist/vue.js`,
      babel: `Babel`,
    }
  },
}
