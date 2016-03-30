'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Student = require('../student/student.model');
var Outreach = require('../student/outreach/outreach.model');

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

function deleteCreatedStudents(students) {
  var promises = _.map(students, function(studentId) {
    return Student.findById(studentId).exec(function(err, student) {
      if (err) throw new Error(err);
      return student.remove();
    });
  });
  return Promise.all(promises);
}

AbsenceRecordSchema.pre('remove', function(next) {
  var self = this;
  Outreach.find({record: self._id}).remove().exec().then(function() {
    return deleteCreatedStudents(self.createdStudents);
  }).then(function() {
    next();
  }).catch(function(err) {
    return next(new Error(err));
  });
});

module.exports = mongoose.model('AbsenceRecord', AbsenceRecordSchema);
