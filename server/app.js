'use strict';
/**
 * Main application file
 */

import express from 'express';
import webpack from 'webpack';
import env from './config/environment';

// Connect to database
require('./config/mongoose');

const app = express();
if(env.env == 'development') {
  console.log('dev: ', env.env);
  const webpackDevServer = require('webpack-dev-server');
  const webpackDevConfig = require('../webpack.config.dev').default;
  const compiler = webpack(webpackDevConfig);

  const server = new webpackDevServer(compiler, webpackDevConfig.devServer);

  server.listen(9000, "localhost", function() {
    console.log("Starting server on http://localhost:8080");
  });
} else {

  var server = require('http').createServer(app);
  require('./config/express')(app);
  require('./routes')(app);

  // Start server
  server.listen(env.port, env.ip, function() {
    console.log('Express server listening on %d, in %s mode', env.port, app.get('env'));
  });

}

// Expose app
exports = module.exports = app;
