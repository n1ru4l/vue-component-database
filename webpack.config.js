'use strict'

require(`dotenv`).config()
const path = require(`path`)


module.exports = {
  entry: {
    main: path.join(__dirname, `src`, `client`, `main.js`),
  },
  output: {
    path: path.resolve(__dirname, `./build`),
    filename: `[name].bundle.js`,
    publicPath: `/build/`,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: `vue-loader`,
      },
      {
        test: /\.css$/,
        use: [ `style-loader`, `css-loader` ],
      },
    ],
  },
  resolve: {
    alias: {
      vue: `vue/dist/vue.js`,
      babel: `Babel`,
    },
  },
}
