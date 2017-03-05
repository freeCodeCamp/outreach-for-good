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

  const wpServer = new webpackDevServer(compiler, webpackDevConfig.devServer);

  wpServer.listen(env.webpackPort, 'localhost', function() {
    console.log('Webpack server listening on %d, in %s mode', env.webpackPort, app.get('env'));
  });
}

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(env.expressPort, 'localhost', function() {
  console.log('Express server listening on %d, in %s mode', env.expressPort, app.get('env'));
});


// Expose app
exports = module.exports = app;
