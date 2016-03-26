'use strict';

var AbsenceRecord = require('../absence-record/absence-record.model');
var Something = require('../something/something.model');
var School = require('../school/school.model');
var Student = require('../student/student.model');

/**
 * Deletes everything except for user models
 * restriction: 'super'
 */
exports.reset = function(req, res) {
  AbsenceRecord.remove().exec().then(function() {
    return Something.remove().exec();
  }).then(function() {
    return School.remove().exec();
  }).then(function() {
    return Student.remove().exec();
  }).then(function() {
    res.sendStatus(200);
  });
};
