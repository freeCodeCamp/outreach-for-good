'use strict';

var Student = require('./student.model');
var School = require('../school/school.model');
var Outreach = require('./outreach/outreach.model');
var Intervention = require('./intervention/intervention.model');
var auth = require('../../auth/auth.service');
var _ = require('lodash');

var populateOptions = {
  path: 'school',
  select: 'name'
};

/**
 * Get list of all students
 * restriction: 'manager'
 */
exports.index = function(req, res) {
  Student
    .find()
    .populate('school', 'name')
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

// Updates an existing student's withdrawn field.
exports.updateWithdrawn = function(req, res) {
  Student.populate(req.student, populateOptions, function(err, student) {
    if (err) return handleError(res, err);
    student.withdrawn = req.body.withdrawn;
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
  var match = {actionDate: null};
  if (req.user.role === 'teacher') {
    match.school = req.user.assignment;
  }
  if (!req.query.withdrawn || req.query.withdrawn === 'false') {
    match.withdrawn = false;
  }
  var pipeline = [{
    $match: match
  }, {
    $group: {
      _id: {school: '$school', schoolYear: '$schoolYear'},
      outreaches: {$push: '$$ROOT'}
    }
  }, {
    $sort: {'_id.schoolYear': -1}
  }, {
    $group: {
      _id: '$_id.school',
      outreaches: {$first: '$outreaches'}
    }
  }, {
    $unwind: '$outreaches'
  }, {
    $group: {
      _id: '$outreaches.type',
      count: {$sum: 1}
    }
  }];
  Outreach.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    return res.status(200).json(results);
  });
};

/**
 * Get summary of outreaches.
 * restriction: 'teacher'
 *
 * Returns an aggregation for records based on the req user role:
 * - teachers will get outreach summary for assignment school
 * - manager+ will get outreach summary for all schools
 */
exports.outreachSummary = function(req, res) {
  var pipeline = [{
    $group: {
      _id: {student: '$student', type: '$type', school: '$school'},
      count: {$sum: 1}
    }
  }, {
    $group: {
      _id: '$_id.student',
      school: {$first: '$_id.school'},
      counts: {$push: {type: '$_id.type', count: '$count'}}
    }
  }, {
    $project: {_id: 0, student: '$_id', counts: 1, school: 1}
  }];
  if (req.user.role === 'teacher') {
    pipeline.unshift({$match: {school: req.user.assignment}});
  }
  Outreach.aggregate(pipeline, function(err, results) {
    if (err) handleError(res, err);
    Outreach.populate(results, [{
      path: 'school',
      model: 'School',
      select: 'name'
    }, {
      path: 'student',
      model: 'Student',
      select: 'firstName lastName studentId iep cfa withdrawn'
    }], function(err, final) {
      if (err) return handleError(res, err);
      return res.status(200).json(final);
    });
  });
};

/**
 * Get summary of interventions.
 * restriction: 'teacher'
 *
 * Returns an aggregation for records based on the req user role:
 * - teachers will get intervention summary for assignment school
 * - manager+ will get intervention summary for all schools
 */
exports.interventionSummary = function(req, res) {
  var pipeline = [{
    $group: {_id: {student: '$student', type: '$type', school: '$school'}}
  }, {
    $project: {
      _id: 0,
      school: '$_id.school',
      student: '$_id.student',
      type: '$_id.type'
    }
  }];
  if (req.user.role === 'teacher') {
    pipeline.unshift({
      $match: {school: req.user.assignment}
    });
  }
  Intervention.aggregate(pipeline, function(err, results) {
    if (err) handleError(res, err);
    Intervention.populate(results, [{
      path: 'school',
      model: 'School',
      select: 'name'
    }, {
      path: 'student',
      model: 'Student',
      select: 'firstName lastName studentId iep cfa withdrawn'
    }], function(err, final) {
      if (err) return handleError(res, err);
      return res.status(200).json(final);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
