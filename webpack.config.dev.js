/*
* @Author: miaojing | 243127395@qq.com
* @Date:   2016-05-12 11:19:19
* @Last Modified by:   interaction
* @Last Modified time: 2016-05-12 11:24:54
*/
const webpack = require('webpack');
const path = require('path');
const configBase = require('./webpack.config');

const {config, PATHS} = configBase


const rules = [
  {
    test: /(\.scss$)|(\.css$)/,
    use: ['style-loader', 'css-loader', 'resolve-url-loader', 'postcss-loader', configBase.sassLoader]
  }
]
config.module.rules = config.module.rules.concat(rules)

config.plugins.unshift(new webpack.LoaderOptionsPlugin({
  options: {
    // fix url-loader path not found error
    // https://github.com/shakacode/bootstrap-loader/issues/185
    context: __dirname,
    output: {
      path: PATHS.dist
    }
  }
}))
config.plugins.push(new webpack.HotModuleReplacementPlugin());

config.devServer = {
  contentBase: PATHS.dist,

  historyApiFallback: true,
  hot: true,
  inline: true,

  stats: 'errors-only',

  host: process.env.HOST,
  port: process.env.PORT,
}

module.exports = config
