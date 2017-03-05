'use strict';
/* eslint-disable no-process-env */

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error(`You must set the ${name} environment variable`);
  }
  return process.env[name];
}

requiredProcessEnv('APP_SECRET');
requiredProcessEnv('SUPER_USER_EMAIL');

// All configurations will extend these options
// ============================================
var all = {
  env : process.env.NODE_ENV,

  // Root path of server
  root : process.env.APP_ROOT || path.normalize(`${__dirname}/../../..`),

  // Webpack Dev Server port
  webpackPort : process.env.PORT || 9000,

  // Express Server port
  expressPort : process.env.PORT || 8080,

  port : process.env.PORT || 8080,

  // Server IP
  ip : process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB : false,

  secrets : {
    session : process.env.APP_SECRET
  },

  superUserEmail : process.env.SUPER_USER_EMAIL,

  // List of user roles
  userRoles : ['guest', 'teacher', 'manager', 'admin', 'super'],

  // MongoDB connection options
  mongo : {
    options : {
      db : {
        safe : true
      }
    }
  },

  google : {
    clientID     : process.env.GOOGLE_ID || 'id',
    clientSecret : process.env.GOOGLE_SECRET || 'secret',
    callbackURL  : `${process.env.DOMAIN || ''}/auth/google/callback`
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {});
