/**
 * Main application routes
 */

'use strict';

const errors = require('./components/errors');
const path = require('path');

module.exports = function(app) {

  // models
  app.use('/api/absence-records', require('./api/absence-record'));
  app.use('/api/schools', require('./api/school'));
  app.use('/api/students', require('./api/student'));
  app.use('/api/users', require('./api/user'));

  // services
  app.use('/auth', require('./auth'));
  app.use('/api/visualizations', require('./api/visualization'));

  // development
  app.use('/api/devs', require('./api/dev'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
