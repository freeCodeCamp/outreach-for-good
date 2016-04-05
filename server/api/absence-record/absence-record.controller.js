'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var AbsenceRecord = require('./absence-record.model');
var Outreach = require('../student/outreach/outreach.model');
var Student = require('../student/student.model');

function dateOnly(dateStr) {
  var date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Absence record creation validation requires:
 *  1. the date selected to be greater than the current newest record's date.
 *  2. the expected previous record id to match current newest record's id.
 *  3. the api request url's schoolId to match the request body's schoolId.
 */
exports.validateCreate = function(req, res, next) {
  AbsenceRecord
    .findOne({school: req.school.id})
    .sort({date: -1})
    .exec(function(err, record) {
      if (!record) return next();
      // Validate data is not stale by matching previousRecordId.
      if (record.id !== req.body.previousRecordId) {
        return handleError(res, {
          error: 'Submitted previous record id does not match.'
        });
      }
      // Validate date selected is more recent than previous record.
      if (dateOnly(req.body.date) <= dateOnly(record.date)) {
        return handleError(res, {
          error: 'Date for upload must be more recent than current record date.'
        });
      }
      // Validate schoolId in request url is the same as on the record.
      if (req.school.id !== req.body.schoolId) {
        return handleError(res, {
          error: 'API url schoolId does not match request body schoolId.'
        });
      }
      return next();
    });
};

function createStudents(newStudents) {
  return new Promise(function(resolve, reject) {
    if (!newStudents.length) return resolve([]);
    Student.collection.insert(newStudents, {ordered: true}, function(err, ins) {
      if (err) return reject(err);
      return resolve(ins.ops);
    });
  });
}

/**
 * Creates a new absence record in the DB.
 * restriction: 'teacher'
 */
exports.create = function(req, res) {
  var result = {};
  var existingEntries = _.map(req.body.updates || [], 'entry');
  var newStudents = _.map(req.body.creates, 'student');
  var newEntries = _.map(req.body.creates, 'entry');
  var outreaches = [];
  // Assign students to be created to validated school.
  _.forEach(newStudents, function(student) {
    student.currentSchool = req.school.id;
  });
  var promise = createStudents(newStudents);
  promise.then(function(createdStudents) {
    // Fill in missing student for new entries.
    _.forEach(createdStudents, function(student, index) {
      newEntries[index].student = student._id;
    });
    var combinedEntries = [].concat.apply(newEntries, existingEntries);
    // Outreaches for entries are update with student and added to outreaches.
    _.forEach(combinedEntries, function(entry) {
      _.forEach(entry.outreaches, function(outreach) {
        outreach.student = entry.student;
        outreaches.push(outreach);
      });
    });
    return AbsenceRecord.create({
      schoolYear: req.body.schoolYear,
      school: req.school.id,
      date: req.body.date,
      entries: combinedEntries,
      missingEntries: req.body.missingEntries,
      newMissingStudents: req.body.newMissingStudents,
      createdStudents: _.map(createdStudents, '_id')
    });
  }).then(function(createdRecord) {
    return createdRecord.populate('school').execPopulate();
  }).then(function(populatedRecord) {
    result.record = populatedRecord;
    // Outreaches updated with the record id and date.
    _.forEach(outreaches, function(outreach) {
      outreach.record = populatedRecord._id;
      outreach.triggerDate = populatedRecord.date;
    });
    return Outreach.create(outreaches);
  }).then(function(createdOutreaches) {
    result.outreaches = createdOutreaches;
    return res.status(200).json(result);
  }).catch(function(err) {
    return handleError(res, err);
  });
};

function currentAbsenceRecordPipeline(user) {
  var match = {};
  if (user.role === 'teacher') {
    match.school = user.assignment;
  }
  return [{
    $match: match
  }, {
    $sort: {date: -1}
  }, {
    $group: {
      _id: '$school',
      recordId: {$first: '$_id'},
      date: {$first: '$date'},
      school: {$first: '$school'},
      schoolYear: {$first: '$schoolYear'},
      entries: {$first: '$entries'},
      missingEntries: {$first: '$missingEntries'}
    }
  }];
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
    AbsenceRecord.populate(results,
      'school entries.student missingEntries.student',
      function(err, records) {
        if (err) return handleError(res, err);
        return res.status(200).json(records);
      });
  });
};

exports.student = function(req, res) {
  var pipeline = [{
    $match: {
      school: req.student.currentSchool,
      'entries.student': req.student._id
    }
  }, {
    $unwind: '$entries'
  }, {
    $match: {'entries.student': req.student._id}
  }, {
    $group: {
      _id: '$schoolYear',
      records: {$push: '$$ROOT'}
    }
  }, {
    $sort: {_id: -1}
  }, {
    $limit: 1
  }, {
    $unwind: '$records'
  }, {
    $project: {
      recordId: '$records._id',
      entry: '$records.entries',
      date: '$records.date'
    }
  }, {
    $sort: {date: -1}
  }];
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    return res.status(200).json(results);
  });
};

exports.validateDelete = function(req, res, next) {
  AbsenceRecord
    .findOne({school: req.record.school})
    .sort({date: -1})
    .exec(function(err, latest) {
      if (err) return handleError(res, err);
      if (latest.id !== req.record.id) {
        return handleError(res, {
          error: 'Submitted record for delete is not current record.'
        });
      }
      return next();
    })
};

exports.delete = function(req, res) {
  req.record.remove(function(err) {
    if (err) return handleError(res, err);
    return res.status(204).send('No Content');
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
