'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AbsenceRecordSchema = new Schema({
  schoolYear: {type: String, required: true},
  school: {type: Schema.Types.ObjectId, ref: 'School', required: true},
  date: {type: Date, required: true},
  entries: [{
    student: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
    absences: {type: Number, required: true},
    absencesDelta: {type: Number, required: true},
    tardies: {type: Number, required: true},
    tardiesDelta: {type: Number, required: true},
    present: {type: Number, required: true},
    enrolled: {type: Number, required: true}
  }],
  createdStudents: [{type: Schema.Types.ObjectId, ref: 'Student'}]
});

module.exports = mongoose.model('AbsenceRecord', AbsenceRecordSchema);
