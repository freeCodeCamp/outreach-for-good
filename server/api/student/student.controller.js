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

// NOTE: Partial updates aren't RESTful.

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

// NOTE: Batch partial updates aren't RESTful.

var validUpdateFields = {
  iep: true,
  cfa: true,
  withdrawn: true
};

exports.validateBatchUpdate = function(req, res, next) {
  if (!validUpdateFields[req.params.field]) {
    return next(new Error('Attempting to update an invalid field.'));
  }
  req.field = req.params.field;
  return next();
};

exports.batchUpdate = function(req, res) {
  var updateValue = !!req.body.value;
  var promises = _.map(req.students, function(student) {
    student[req.field] = updateValue;
    return student.save(function(err) {
      if (err) return handleError(res, err);
      return student;
    });
  });
  Promise.all(promises).then(function(saved) {
    return res.status(200).json(saved);
  }).catch(function(err) {
    return handleError(res, err);
  })
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
  var match = {};
  if (req.user.role === 'teacher') {
    match.school = req.user.assignment;
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
    $unwind: '$outreaches'
  }, {
    $project: {
      _id: false,
      student: '$outreaches.student',
      type: '$outreaches.type',
      school: '$outreaches.school',
      resolved: {$cond: [{$gt: ['$outreaches.actionDate', 0]}, 1, 0]}
    }
  }, {
    $group: {
      _id: {student: '$student', type: '$type', school: '$school'},
      count: {$sum: 1},
      resolved: {$sum: '$resolved'}
    }
  }, {
    $group: {
      _id: '$_id.student',
      school: {$first: '$_id.school'},
      counts: {$push: {
        type: '$_id.type',
        count: '$count',
        resolved: '$resolved',
        outstanding: {$subtract: ['$count', '$resolved']}
      }}
    }
  }, {
    $project: {_id: false, student: '$_id', counts: 1, school: 1}
  }];
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
  console.log(err);
  return res.status(500).send(err);
}
