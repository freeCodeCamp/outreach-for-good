'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var AbsenceRecord = require('./absence-record.model');
var Outreach = require('../student/outreach/outreach.model');

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
  pipeline.push({
    $unwind: '$entries'
  });
  return pipeline;
}

/**
 * Get entries from current absence records
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
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

/**
 * Get entries from current absence records with outreach filter
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
      var pipeline = currentAbsenceRecordPipeline(req.user);
      pipeline.push({
        $match: {'entries.student': {$in: students}}
      });
      AbsenceRecord.aggregate(pipeline, function(err, results) {
        if (err) return handleError(res, err);
        AbsenceRecord.populate(results, 'school entries.student',
          function(err, entries) {
            if (err) return handleError(res, err);
            return res.status(200).json(entries);
          });
      });
    });
};

/**
 * Get list of students at risk of becoming chronically absent from current
 * absence records.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
exports.atRisk = function(req, res) {
  var pipeline = currentAbsenceRecordPipeline(req.user);
  pipeline.push({
    $match: {'entries.absences': {$lte: 19}}
  });
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    AbsenceRecord.populate(results, 'school entries.student',
      function(err, entries) {
        if (err) return handleError(res, err);
        entries = _.filter(entries, function(entry) {
          return entry.entries.present / entry.entries.enrolled <= 0.9;
        });
        return res.status(200).json(entries);
      });
  });
};

/**
 * Get list of chronically absent student from from current absence records.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
exports.chronic = function(req, res) {
  var pipeline = currentAbsenceRecordPipeline(req.user);
  pipeline.push({
    $match: {'entries.absences': {$gte: 20}}
  });
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    AbsenceRecord.populate(results, 'school entries.student',
      function(err, entries) {
        if (err) return handleError(res, err);
        return res.status(200).json(entries);
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
      createdStudents: '$records.createdStudents',
      date: '$records.date',
      entries: '$records.entries'
    }
  }];
  AbsenceRecord.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    AbsenceRecord.populate(results, {
        path: 'createdStudents',
        model: 'Student',
        select: 'firstName lastName studentId'
      },
      function(err, records) {
        if (err) return handleError(res, err);
        return res.status(200).json(records);
      });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
