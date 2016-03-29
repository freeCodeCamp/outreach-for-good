'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var AbsenceRecord = require('./absence-record.model');
var Outreach = require('../student/outreach/outreach.model');
var Student = require('../student/student.model');

function newAbsenceRecord(record, res, createdStudents) {
  return AbsenceRecord.create(record, function(err, createdRecord) {
    if (err) return handleError(res, err);
    var outreaches = [];
    _.forEach(record.entries, function(entry) {
      _.forEach(entry.outreaches, function(outreach) {
        outreach.student = entry.student;
        outreach.record = createdRecord.id;
        outreach.triggerDate = record.date;
        outreaches.push(outreach);
      });
    });
    createdRecord.populate('school', function(err) {
      if (err) return handleError(res, err);
      Outreach.create(outreaches, function(err, createdOutreaches) {
        if (err) return handleError(res, err);
        return res
          .status(200)
          .json({
            record: createdRecord,
            outreaches: createdOutreaches,
            students: createdStudents
          });
      });
    });
  });
}

function dateOnly(dateStr) {
  var date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Absence record creation validation requires the date selected to be
 * greater than the current newest record's date and the expected previous
 * record date to match.
 */
exports.validateCreate = function(req, res, next) {
  AbsenceRecord
    .findOne({school: req.school.id})
    .sort({date: -1})
    .exec(function(err, record) {
      if (!record) return next();
      // Validate data is not stale by matching previousRecordId.
      if (record.id !== req.body.previousRecordId) {
        return res.status(500).send({
          error: 'Submitted previous record id does not match.'
        });
      }
      // Validate date selected is more recent than previous record.
      if (dateOnly(req.body.date) <= dateOnly(record.date)) {
        return res.status(500).send({
          error: 'Date for upload must be more recent than current record date.'
        });
      }
      return next();
    });
};

/**
 * Creates a new absence record in the DB.
 * restriction: 'teacher'
 */
exports.create = function(req, res) {
  var school = req.body.schoolId;
  var existingEntries = _.map(req.body.updates || [], 'entry');
  if (!req.body.creates) {
    return newAbsenceRecord({
      schoolYear: req.body.schoolYear,
      school: school,
      date: req.body.date,
      entries: existingEntries
    }, res, []);
  }
  var newStudents = _.map(req.body.creates, 'student');
  var newEntries = _.map(req.body.creates, 'entry');
  _.forEach(newStudents, function(student) {
    student.currentSchool = school;
  });
  Student.collection.insert(newStudents, {ordered: true}, function(err, ins) {
    var createdStudents = ins.ops;
    if (err) return handleError(res, err);
    _.forEach(createdStudents, function(student, index) {
      newEntries[index].student = student._id;
    });
    return newAbsenceRecord({
      schoolYear: req.body.schoolYear,
      school: school,
      date: req.body.date,
      entries: [].concat.apply(newEntries, existingEntries)
    }, res, createdStudents);
  });
};

function currentAbsenceRecordPipeline(user) {
  var pipeline = [];
  if (user.role === 'teacher') {
    pipeline.push({
      $match: {school: user.assignment}
    });
  }
  pipeline.push({
    $sort: {date: -1}
  });
  pipeline.push({
    $group: {
      _id: '$school',
      recordId: {$first: '$_id'},
      date: {$first: '$date'},
      school: {$first: '$school'},
      entries: {$first: '$entries'}
    }
  });
  return pipeline;
}

/**
 * Get current absence records.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get record for assignment school
 * - manager+ will get records for all schools
 */
exports.current = function(req, res) {
  var pipeline = currentAbsenceRecordPipeline(req.user);
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    AbsenceRecord.populate(results, 'school entries.student',
      function(err, entries) {
        if (err) return handleError(res, err);
        return res.status(200).json(entries);
      });
  });
};


function handleError(res, err) {
  return res.status(500).send(err);
}
