'use strict';
/* eslint-disable no-process-env */

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo : {
    uri : process.env.MONGOLAB_URI
            || process.env.MONGOHQ_URL
            || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME
            || 'mongodb://localhost/cfa-local'
  },

  // Raven connection options
  raven : {
    dsn : process.env.RAVEN_DSN
            || undefined
  },

  seedDB : false,

  debug : '*'
};
