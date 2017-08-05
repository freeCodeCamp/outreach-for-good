/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var Raven = require('raven');

var express = require('express');
var mongoose = require('mongoose');
var Raven = require('raven');
var app;

var config = require('./config/environment');
if(!config.raven.dsn) {
	throw new Error('You must set the raven environment variable');
}
Raven.config(config.raven.dsn).install();
Raven.context(function () {

	// Connect to database
	mongoose.connect(config.mongo.uri, config.mongo.options);
	mongoose.connection.on('error', function(err) {
		console.error('MongoDB connection error: ' + err);
		process.exit(-1);
		}
	);
	// Populate DB with sample data
	if(config.seedDB) { require('./config/seed'); }

	// Setup server
	app = express();
	app.use(Raven.requestHandler());

	var server = require('http').createServer(app);
	require('./config/express')(app);
	require('./routes')(app);

	// Start server
	server.listen(config.port, config.ip, function () {
		console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
	});

});

// Expose app
exports = module.exports = app;
