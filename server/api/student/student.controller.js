'use strict';

var Student = require('./student.model');
var Outreach = require('./outreach/outreach.model');
var auth = require('../../auth/auth.service');

var populateOptions = {
  path: 'currentSchool',
  select: 'name'
};

/**
 * Get list of all students
 * restriction: 'manager'
 */
exports.index = function(req, res) {
  Student
    .find()
    .populate('currentSchool', 'name')
    .exec(function(err, students) {
      if (err) return handleError(res, err);
      return res.status(200).json(students);
    });
};

/**
 * Get single student by id
 * restriction: 'teacher'
 */
exports.show = function(req, res) {
  Student.populate(req.student, populateOptions, function(err, student) {
    if (err) return handleError(res, err);
    return res.status(200).json(student);
  });
};

// Updates an existing student's iep field.
exports.updateIEP = function(req, res) {
  Student.populate(req.student, populateOptions, function(err, student) {
    if (err) return handleError(res, err);
    student.iep = req.body.iep;
    student.save(function(err) {
      if (err) return handleError(res, err);
      return res.status(200).json(student);
    });
  });
};

// Updates an existing student's cfa field.
exports.updateCFA = function(req, res) {
  Student.populate(req.student, populateOptions, function(err, student) {
    if (err) return handleError(res, err);
    student.cfa = req.body.cfa;
    student.save(function(err) {
      if (err) return handleError(res, err);
      return res.status(200).json(student);
    });
  });
};

/**
 * Get current outstanding outreach counts.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get outreach counts for assignment school
 * - manager+ will get outreach counts for all schools
 */
exports.outreachCounts = function(req, res) {
  var pipeline = [{
    $match: {actionDate: null}
  }, {
    $group: {
      _id: '$type',
      count: {$sum: 1}
    }
  }];
  if (req.user.role === 'teacher') {
    pipeline[0].$match.school = req.user.assignment;
  }
  Outreach.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    return res.status(200).json(results);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
