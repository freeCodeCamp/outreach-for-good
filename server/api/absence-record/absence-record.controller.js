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
  School.find({name: req.query.school}, function (err, schools) {
      if(err) { return handleError(res, err); }
      var schoolID = schools[0]._id;
      console.log(schoolID);
      AbsenceRecord.find({school: schoolID}, function (err, records) {
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

/**
 * Creates a new absence record in the DB.
 * restriction: 'teacher'
 */
exports.create = function(req, res) {

  var school = req.params.schoolId;
  var newData = req.body.creates;

  var newStudents = _.pluck(newData, 'student');
  var newEntries = _.pluck(newData, 'entry');
  var newIds = [];

  _.each(newStudents, function(student) { 
    newIds.push(student.studentId);
  });
  _.map(newStudents, function(student) {
    student.currentSchool = school;
  })
  
  // Create new students from newStudents Array
  Student.collection.insert(newStudents, {ordered: true});
  // Collect newly created student _ids for entries
  Student.find({'studentId' : {$in : newIds}}, function(err, stus) {
    if (err) { return handleError(res, err); }
    _.forEach(newEntries, function(entry, idx) {
      entry.student = stus[idx]._id;
    })
    // Create object that will be the new Abs Record
    var newAbsRec = {
      schoolYear: newData[0].schoolYear,
      school: school,
      entries: newEntries
    }
    console.log(newAbsRec);
    // Create new absence record collection
    AbsenceRecord.collection.insert(newAbsRec);
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
