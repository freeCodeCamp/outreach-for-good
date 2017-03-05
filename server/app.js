'use strict';
/**
 * Main application file
 */

var express = require('express');
var webpack = require('webpack');
var env = require('./config/environment');
const debug = require('debug')('app:main');

// Connect to database
require('./config/mongoose');

const app = express();
if(env.env == 'development') {
  const webpackDevServer = require('webpack-dev-server');
  const webpackDevConfig = require('../webpack.config.dev');
  const compiler = webpack(webpackDevConfig);

  const wpServer = new webpackDevServer(compiler, webpackDevConfig.devServer);

  wpServer.listen(env.webpackPort, 'localhost', function() {
    debug('Webpack server listening on %d, in %s mode', env.webpackPort, app.get('env'));
  });
}

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(env.port, 'localhost', function() {
  debug('Express server listening on %d, in %s mode', env.port, app.get('env'));
});


// Expose app
exports = module.exports = app;
