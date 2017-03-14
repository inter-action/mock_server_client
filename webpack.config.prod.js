/*
* @Author: miaojing | 243127395@qq.com
* @Date:   2016-05-12 11:19:48
* @Last Modified by:   interaction
* @Last Modified time: 2016-05-12 11:25:39
*/
const path = require('path');
const webpack = require('webpack')
const configBase = require('./webpack.config')
const config = configBase.config
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractText = new ExtractTextPlugin('[name].[chunkhash].css')
const pkg = require('./package.json');

const PATHS = configBase.PATHS;

Object.assign(config.entry, { vendor: Object.keys(pkg.dependencies) })
config.output = {
  path: PATHS.dist,
  // filename: '[name].js',
  // Create a hash for each file in the build so we can detect which files have changed
  filename: '[name].[chunkhash].js',
  chunkFilename: '[chunkhash].js',
}

//https://github.com/jtangelder/sassloader/issues/329
const rules = [
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['style', 'css']
    }),
    exclude: /node_modules/,
  },
  {
    test: /(\.scss$)|(\.css$)/,
    use: extractText.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        'resolve-url-loader',
        'postcss-loader',
        configBase.sassLoader
      ]
    }),
    exclude: /node_modules/,
  }
]

var plugins = [
  new webpack.LoaderOptionsPlugin({
    debug: true,
    // fix url-loader path not found error
    // https://github.com/shakacode/bootstrap-loader/issues/185
    context: __dirname,
    output: {
      path: PATHS.dist
    },
    // postcss
    postcss: [
      require('autoprefixer')({
        browsers: [
          'last 3 version',
          'ie >= 10',
        ],
      })
    ]
  }),
  extractText,
  // Split dependencies into a `vendor` file and provide a manifest
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest'],
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
]

config.plugins = config.plugins.concat(plugins)
config.module.rules = config.module.rules.concat(rules)


module.exports = config

