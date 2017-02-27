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
  const webpackDevConfig = require('../webpack.config.dev').default;
  const compiler = webpack(webpackDevConfig);

  app.use(require('connect-history-api-fallback')(compiler));
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath : webpackDevConfig.output.publicPath,
    noInfo     : false,
    quiet      : false,
    stats      : {
      assets       : false,
      colors       : true,
      version      : false,
      hash         : false,
      timings      : false,
      chunks       : false,
      chunkModules : false
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(env.port, env.ip, function() {
  console.log('Express server listening on %d, in %s mode', env.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
