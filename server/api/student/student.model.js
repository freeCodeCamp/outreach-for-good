'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schoolYearSchema = new Schema({
	schoolYear: Number,
	allAbsences: Number,
	tardy: Number,
	present: Number,
	enrolled: Number
});

var StudentSchema = new Schema({
  _id: Number, // Student ID
  lastName: String,
  firstName: String,
  statistics: [schoolYearSchema]
});

module.exports = mongoose.model('schoolYear', schoolYearSchema);
module.exports = mongoose.model('Student', StudentSchema);