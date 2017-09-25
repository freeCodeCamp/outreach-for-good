var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  devtool : 'source-map',
  entry   : path.resolve(__dirname, 'client/index'),
  target  : 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output  : {
    path       : path.resolve(__dirname, 'dist/public'),
    publicPath : '/',
    filename   : '[name].[chunkhash].js'
  },
  plugins : [
    // Hash the files using MD5 so that their names change when the content changes.
    new WebpackMd5Hash(),
    // Generate an external css file with a hash in the filename
    new ExtractTextPlugin('[name].[contenthash].css'),
    // Generate HTML file that contains references to generated bundles. See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
    new HtmlWebpackPlugin({
      template : 'client/index.ejs',
      minify   : {
        removeComments                : true,
        collapseWhitespace            : true,
        removeRedundantAttributes     : true,
        useShortDoctype               : true,
        removeEmptyAttributes         : true,
        removeStyleLinkTypeAttributes : true,
        keepClosingSlash              : true,
        minifyJS                      : true,
        minifyCSS                     : true,
        minifyURLs                    : true
      },
      inject : true
    }),
    new webpack.DefinePlugin({
      'process.env' : {
        NODE_ENV : JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module : {
    loaders : [
      {
        test    : /\.js$/,
        include : path.join(__dirname, 'client'),
        loader  : 'babel-loader',
        query   : {
          presets : ['es2015', 'react', 'stage-2']
        }
      }, {
        test    : /(\.css)$/,
        loaders : ['style-loader', 'css-loader']
      }, {
        test   : /\.scss$/,
        loader : ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test   : /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'file-loader'
      }, {
        test   : /\.png$/,
        loader : 'url-loader?limit=100000'
      }, {
        test   : /\.jpg$/,
        loader : 'file-loader'
      }, {
        test   : /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test   : /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'url-loader?limit=10000&mimetype=application/octet-stream'
      }, {
        test   : /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'file-loader'
      }, {
        test   : /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'url-loader?limit=10000&mimetype=image/svg+xml'
      }
    ]
  }
};
