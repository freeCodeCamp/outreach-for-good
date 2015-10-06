'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StudentSchema = new Schema({
  	_id: Number, // Student ID
  	LastName: String,
  	FirstName: String,
  	Statistics: [{
  		SchoolYear: Number,
  		AllAbsences: Number,
  		Tardy: Number,
  		Present: Number,
  		Enrolled: Number
  	}]
});

module.exports = mongoose.model('Student', StudentSchema);