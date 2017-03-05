'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:           'http://localhost:9000',
  APP_SECRET:       'app-secret',
  SUPER_USER_EMAIL: 'test@example.com',

  GOOGLE_ID:        '8575487975-d4a90bsqjt7lnr9jcjjg6dpnp6sk68kh.apps.googleusercontent.com',
  GOOGLE_SECRET:    'T-MRUqBYwHdSdCFNouHgQpdJ',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
