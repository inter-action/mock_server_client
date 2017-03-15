const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');


const PATHS = {
  dist: path.resolve(__dirname, 'dist')
};

const config = {
  entry: {
    main: path.resolve(__dirname, 'src/index.js'),
    style: path.join(__dirname, 'src/main.scss'),
  },
  output: {
    path: PATHS.dist,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2|otf)$/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
          query: {
            limit: '10000'
          }
        }
      },
      {
        test: /\.svg/,
        use: ['svg-url-loader']
      }
    ],

  },
  plugins: [//dot not delete this
    new HtmlWebpackPlugin({
      title: 'github_blog',
      template: 'index_template.ejs'
    })
  ]
}


module.exports = {
  PATHS,
  config: config,
  sassLoader: {
    loader: 'sass-loader',
    query: {
      includePaths: [path.resolve(__dirname, 'src')],
      sourceMap: true
    }
  }
}
