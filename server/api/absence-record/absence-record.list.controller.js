'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var AbsenceRecord = require('./absence-record.model');
var Outreach = require('../student/outreach/outreach.model');

var populateOptions = [{
  path: 'school',
  model: 'School',
  select: 'name'
}, {
  path: 'student',
  model: 'Student',
  select: 'firstName lastName studentId iep cfa withdrawn'
}];

function absenceRecordPipeline(user, year) {
  var match = {};
  if (user.role === 'teacher') match.school = user.assignment;
  if (year) match.schoolYear = year;

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
      entries: {$first: '$entries'},
      missingEntries: {$first: '$missingEntries'}
    }
  }, {
    $project: {
      _id: false,
      recordId: 1,
      date: 1,
      school: 1,
      entries: {$setUnion: ['$entries', '$missingEntries']}
    }
  }, {
    $unwind: '$entries'
  }, {
    $sort: {
      school: 1,
      'entries.date': -1
    }
  }, {
    $project: {
      recordId: 1,
      date: 1,
      school: 1,
      entry: '$entries',
      student: '$entries.student'
    }
  }];
}

/**
 * Get entries from current absence records.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
exports.current = function(req, res) {
  var pipeline = absenceRecordPipeline(req.user);
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    AbsenceRecord.populate(results, populateOptions, function(err, docs) {
      if (err) return handleError(res, err);
      return res.status(200).json(docs);
    });
  });
};

/**
 * Get entries from specified absence record year.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
exports.year = function(req, res) {
  var pipeline = absenceRecordPipeline(req.user, req.params.year);
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    AbsenceRecord.populate(results, populateOptions, function(err, docs) {
      if (err) return handleError(res, err);
      return res.status(200).json(docs);
    });
  });
};

/**
 * Get entries for students with outreaches specified by filter.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
exports.query = function(req, res) {
  var options = {
    actionDate: null,
    type: req.query.type
  };
  if (req.query.tier) {
    options.tier = req.query.tier
  }
  Outreach.find(options)
    .distinct('student')
    .exec(function(err, students) {
      if (err) return handleError(res, err);
      var pipeline = absenceRecordPipeline(req.user);
      pipeline.push({
        $match: {'student': {$in: students}}
      });
      AbsenceRecord.aggregate(pipeline, function(err, results) {
        if (err) return handleError(res, err);
        AbsenceRecord.populate(results, populateOptions, function(err, docs) {
          if (err) return handleError(res, err);
          return res.status(200).json(docs);
        });
      });
    });
};

/**
 * Get entries for students at risk of becoming chronically absent.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
exports.atRisk = function(req, res) {
  var pipeline = absenceRecordPipeline(req.user);
  pipeline.push({
    $match: {'entry.absences': {$lte: 19}}
  });
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    AbsenceRecord.populate(results, populateOptions, function(err, docs) {
      if (err) return handleError(res, err);
      docs = _.filter(docs, function(doc) {
        return doc.entry.present / doc.entry.enrolled <= 0.9;
      });
      return res.status(200).json(docs);
    });
  });
};

/**
 * Get entries of chronically absent students.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
exports.chronic = function(req, res) {
  var pipeline = absenceRecordPipeline(req.user);
  pipeline.push({
    $match: {'entry.absences': {$gte: 20}}
  });
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    AbsenceRecord.populate(results, populateOptions, function(err, docs) {
      if (err) return handleError(res, err);
      return res.status(200).json(docs);
    });
  });
};

/**
 * Get list of absence records for the most recent schoolYear for the school.
 * restriction: 'teacher'
 */
exports.school = function(req, res) {
  var pipeline = [{
    $match: {
      school: req.school._id
    }
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
    $sort: {'records.date': -1}
  }, {
    $project: {
      _id: false,
      recordId: '$records._id',
      schoolYear: '$_id',
      date: '$records.date',
      entries: '$records.entries',
      newMissingStudents: '$records.newMissingStudents',
      createdStudents: '$records.createdStudents'
    }
  }];
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    AbsenceRecord.populate(results, [{
      path: 'createdStudents',
      model: 'Student',
      select: 'firstName lastName studentId'
    }, {
      path: 'newMissingStudents',
      model: 'Student',
      select: 'firstName lastName studentId'
    }], function(err, docs) {
      if (err) return handleError(res, err);
      return res.status(200).json(docs);
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
