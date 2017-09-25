'use strict';
/**
 * Main application file
 */

var express = require('express');
var webpack = require('webpack');
var raven = require('raven');
var env = require('./config/environment');
const debug = require('debug')('app:main');

// Connect to database
require('./config/mongoose');

const app = express();

// Add Sentry.io request and error handler middleware
if(env.raven_dsn) {
  debug('Sentry.io reporting enabled');
  raven.config(env.raven_dsn).install();
  app.use(raven.requestHandler());
  app.use(raven.errorHandler());
}

// Use webpack-dev-server for HMR durring development
if(env.env == 'development') {
  const webpackDevServer = require('webpack-dev-server');
  const webpackDevConfig = require('../webpack.config.dev');
  const compiler = webpack(webpackDevConfig);

  const wpServer = new webpackDevServer(compiler, webpackDevConfig.devServer);

  wpServer.listen(env.webpackPort, 'localhost', function() {
    debug('  🌎  Webpack server listening on %d, in %s mode', env.webpackPort, app.get('env'));
    debug('DeprecationWarning: loaderUtils.parseQuery() - caused by babel, fixed in v7.0');
  });
}

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(env.port, env.ip, function() {
  debug('  🌎  Express server listening on %d, in %s mode', env.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
