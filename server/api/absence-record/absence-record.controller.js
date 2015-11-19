'use strict';

var _ = require('lodash');
var AbsenceRecord = require('./absence-record.model');
var School = require('../school/school.model');
var Student = require('../student/student.model');

/**
 * Get list of absence records
 * restriction: 'manager'
 */
exports.index = function(req, res) {
  AbsenceRecord.find(function(err, records) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(records);
  });
};

/**
 * Get list of absence records by school
 * restriction: 'teacher'
 */
exports.bySchool = function(req, res) {
  School.find({name: req.query.school}, function(err, schools) {
    if (err) { return handleError(res, err); }
    var schoolID = schools[0]._id;
    console.log(schoolID);
    AbsenceRecord.find({school: schoolID}, function(err, records) {
      var result = records[0];
      console.log(result);
      return res.status(200).json(result);
    });
  });
};

/**
 * Get a single absence record
 * restriction: 'teacher'
 */
exports.show = function(req, res) {
  AbsenceRecord.findById(req.params.id, function(err, record) {
    if (err) { return handleError(res, err); }
    if (!record) { return res.status(404).send('Not Found'); }
    return res.json(record);
  });
};

function newAbsenceRecord(record, res) {
  return AbsenceRecord.create(record, function(err, createdRecord) {
    if (err) return handleError(res, err);
    return res.status(200).json(createdRecord);
  });
}

/**
 * Creates a new absence record in the DB.
 * restriction: 'teacher'
 */
exports.create = function(req, res) {
  var school = req.params.schoolId;
  var existingEntries = _.pluck(req.body.updates || [], 'entry');
  if (!req.body.creates) {
    return newAbsenceRecord({
      schoolYear: req.body.updates[0].schoolYear,
      school: school,
      entries: existingEntries
    }, res);
  }
  var newStudents = _.pluck(req.body.creates, 'student');
  var newEntries = _.pluck(req.body.creates, 'entry');
  _.forEach(newStudents, function(student) {
    student.currentSchool = school;
  });
  Student.collection.insert(newStudents, {ordered: true},
    function(err, createdStudents) {
      if (err) return handleError(res, err);
      _.forEach(createdStudents.ops, function(student, index) {
        newEntries[index].student = student._id;
      });
      return newAbsenceRecord({
        schoolYear: req.body.creates[0].schoolYear,
        school: school,
        entries: [].concat.apply(newEntries, existingEntries)
      }, res);
    });
};

/**
 * Updates an existing absence record in the DB.
 * restriction: 'teacher'
 */
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }
  AbsenceRecord.findById(req.params.id, function(err, record) {
    if (err) { return handleError(res, err); }
    if (!record) { return res.status(404).send('Not Found'); }
    var updated = _.merge(record, req.body);
    updated.save(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(record);
    });
  });
};

/**
 * Deletes a absence record from the DB.
 * restriction: 'teacher'
 */
exports.destroy = function(req, res) {
  AbsenceRecord.findById(req.params.id, function(err, record) {
    if (err) { return handleError(res, err); }
    if (!record) { return res.status(404).send('Not Found'); }
    record.remove(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
