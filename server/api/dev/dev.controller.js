'use strict';

var AbsenceRecord = require('../absence-record/absence-record.model');
var School = require('../school/school.model');
var Student = require('../student/student.model');
var Intervention = require('../student/intervention/intervention.model');
var Outreach = require('../student/outreach/outreach.model');
var StudentNote = require('../student/note/note.model');

/**
 * Deletes everything except for user models
 * restriction: 'super'
 */
exports.reset = function(req, res) {
  AbsenceRecord.remove().exec().then(function() {
    return Outreach.remove().exec();
  }).then(function() {
    return Intervention.remove().exec();
  }).then(function() {
    return School.remove().exec();
  }).then(function() {
    return Student.remove().exec();
  }).then(function() {
    return StudentNote.remove().exec();
  }).then(function() {
    res.sendStatus(200);
  });
};
