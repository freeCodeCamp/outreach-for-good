/**
 * Mongoose configuration
 */

'use strict';

import mongoose from 'mongoose';
import debug from 'debug';
import env from './environment';

/* eslint-disable no-process-exit */

mongoose.connect(env.mongo.uri, env.mongo.options);

mongoose.connection.on('connected', function() {
  debug(`MongoDB connection established: ${env.mongo.uri}`);
});

mongoose.connection.on('disconnected', function() {
  debug(`MongoDB connection disconnected: ${env.mongo.uri}`);
});

mongoose.connection.on('error', function(err) {
  debug(`MongoDB connection error: ${err}`);
  throw new Error(err);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    debug('Mongoose disconnected after app termination');
    process.exit(0);
  });
});

// Populate DB with sample data
if(env.seedDB) {
  require('./seed');
}
