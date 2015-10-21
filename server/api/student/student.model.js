'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StudentSchema = new Schema({
  studentId: {type: String, required: true, index: true},
  lastName: {type: String, required: true, trim: true},
  firstName: {type: String, required: true, trim: true},
  currentSchool: {type: Schema.Types.ObjectId, ref: 'School'},
  active: {type: Boolean, default: true}
});

module.exports = mongoose.model('Student', StudentSchema);
