import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import env from './server/config/environment';

export default {
  devtool : 'inline-source-map',
  entry   : [
    'babel-polyfill',
    './client/index.js',
    'webpack/hot/dev-server',
    `webpack-dev-server/client?http://localhost:${env.webpackPort}/`,
  ],
  target : 'web',
  output : {
    path       : path.resolve(__dirname, 'dist'),
    publicPath : '/',
    filename   : 'bundle.js'
  },
  plugins : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template : 'client/index.ejs',
      minify   : {
        removeComments     : true,
        collapseWhitespace : true
      }
    })
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
  },
  devServer : {
    contentBase        : path.join(__dirname, 'client'),
    historyApiFallback : true,
    hot                : true,
    port               : env.webpackPort,
    noInfo             : false,
    quiet              : false,
    stats              : {
      assets       : false,
      colors       : true,
      version      : false,
      hash         : false,
      timings      : false,
      chunks       : false,
      chunkModules : false
    },
    proxy : {
      '/auth' : `http://localhost:${env.expressPort}`
    }
  }
};
