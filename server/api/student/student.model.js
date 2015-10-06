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
  	statistics: [SchoolYearSchema]
});

var SchoolYear = mongoose.model('SchoolYear', SchoolYearSchema);
var Student = mongoose.model('Student', StudentSchema);

module.exports = {
		SchoolYear: SchoolYear,
		Student: Student
};