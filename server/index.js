'use strict';

// Set default node environment to development
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test') {
  process.env.DEBUG = 'app:*,api:*,config:*,webpack:*';
  process.env.APP_SECRET = '123123abcabc';
}

// Export the application
exports = module.exports = require('./app');
