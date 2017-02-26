'use strict';
/* eslint-disable no-process-env */

require('dotenv').config({path: 'server/config/local.env'});

// Set default node environment to development
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test') {
  process.env.DEBUG = 'app:*,api:*,config:*,webpack:*';
  process.env.APP_SECRET = '123123abcabc';
}

// Export the application
exports = module.exports = require('./app');
