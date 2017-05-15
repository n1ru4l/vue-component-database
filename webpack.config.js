'use strict'

require(`dotenv`).config()
const path = require(`path`)
const ExtractTextPlugin = require(`extract-text-webpack-plugin`)
const webpack = require(`webpack`)
const OptimizeCssAssetsPlugin = require(`optimize-css-assets-webpack-plugin`)
const BundleAnalyzerPlugin = require(`webpack-bundle-analyzer`).BundleAnalyzerPlugin

const { env } = process
const IS_PRODUCTION = env.NODE_ENV === `production`

const extractStyles = new ExtractTextPlugin({
  disable: !IS_PRODUCTION,
  filename: `[name].bundle.css`,
})

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: IS_PRODUCTION ? `'production'` : `'development'`,
  },
})

module.exports = {
  entry: {
    main: path.join(__dirname, `src`, `client`, `main.js`),
    iframe: path.join(__dirname, `src`, `client`, `iframe`, `index.js`),
  },
  output: {
    path: path.resolve(__dirname, `./build`),
    filename: `[name].bundle.js`,
    publicPath: `/build/`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: `babel-loader`,
        exclude: [ /node_modules\/postcss/ ],
      },
      {
        test: /\.vue$/,
        loader: `vue-loader`,
        options: {
          extractCSS: IS_PRODUCTION,
        },
      },
      {
        test: /\.css$/,
        use: extractStyles.extract({
          fallback: [ `style-loader` ],
          use: `css-loader`,
        }),
      },
      {
        test: /\.less$/,
        use: extractStyles.extract({
          fallback: [ `style-loader` ],
          use: [ `css-loader`, `less-loader` ],
        }),
      },
      {
        test: /\.(graphql)$/,
        exclude: /node_modules/,
        loader: `graphql-tag/loader`,
      },
    ],
  },
  resolve: {
    alias: {
      babel: `Babel`,
      vue: `vue/dist/vue.esm.js`, // We need the template  compiler included build!
    },
    extensions: [
      `.webpack.js`,
      `.web.js`,
      `.js`,
      `.json`,
      `.vue`,
    ],
    modules: [
      `node_modules`,
      `src/client`,
    ],
  },
  plugins: [
    extractStyles,
    definePlugin,
  ],
  devServer: {
    port: env.WEBPACK_DEV_PORT,
    headers: {
      'Access-Control-Allow-Origin': `*`,
      'Access-Control-Allow-Methods': `GET, POST, PUT, DELETE, PATCH, OPTIONS`,
      'Access-Control-Allow-Headers': `X-Requested-With, content-type, Authorization`
    },
  },
}

if (IS_PRODUCTION) {
  const optimizeCssAssetsPlugin = new OptimizeCssAssetsPlugin()
  const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin()
  const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
    analyzerMode: `static`,
    reportFilename: `bundle.info.html`,
  })
  module.exports.plugins.push(
    optimizeCssAssetsPlugin,
    uglifyJsPlugin,
    bundleAnalyzerPlugin
  )
} else {
  module.exports.devtool = `#cheap-module-eval-source-map`

  const hotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin()
  module.exports.plugins.push(hotModuleReplacementPlugin)
}
