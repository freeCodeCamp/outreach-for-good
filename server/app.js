/**
 * Main application file
 */

'use strict';

// Set default node environment to development

import express from 'express';
import webpack from 'webpack';
import config from '../webpack.config.dev';
import env from './config/environment';

// Connect to database
require('./config/mongoose');

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo     : true,
  publicPath : config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(env.port, env.ip, function() {
  console.log('Express server listening on %d, in %s mode', env.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
