'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SchoolYearSchema = new Schema({
		SchoolYear: Number,
		AllAbsences: Number,
		Tardy: Number,
		Present: Number,
		Enrolled: Number
});

var StudentSchema = new Schema({
  	_id: Number, // Student ID
  	lastName: String,
  	firstName: String,
  	statistics: [schoolYearSchema]
});

module.exports = mongoose.model('SchoolYear', schoolYearSchema);
module.exports = mongoose.model('Student', StudentSchema);