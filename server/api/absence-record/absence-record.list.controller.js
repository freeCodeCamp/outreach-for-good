'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var AbsenceRecord = require('./absence-record.model');
var Intervention = require('../intervention/intervention.model');
var Student = require('../student/student.model');

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
 * Get entries from current absence records with intervention filter
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
  Intervention.find(options)
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

function handleError(res, err) {
  return res.status(500).send(err);
}
