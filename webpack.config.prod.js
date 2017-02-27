import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export default {
  devtool : 'source-map',
  entry   : path.resolve(__dirname, 'client/index'),
  target  : 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output  : {
    path       : path.resolve(__dirname, 'dist'),
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
