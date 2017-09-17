'use strict';
/* eslint-disable no-process-env */

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip : process.env.OPENSHIFT_NODEJS_IP
            || process.env.IP
            || undefined,

  // Server port
  port : process.env.OPENSHIFT_NODEJS_PORT
            || process.env.PORT
            || 9002,

  // MongoDB connection options
  mongo : {
    uri : process.env.MONGOLAB_URI
            || process.env.MONGOHQ_URL
            || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME
            || 'mongodb://localhost/app'
  },

  // Raven connection options
  raven : {
    dsn : process.env.RAVEN_DSN
            || undefined
  }
};
