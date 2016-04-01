'use strict';

var Student = require('./student.model');
var School = require('../school/school.model');
var Outreach = require('./outreach/outreach.model');
var Intervention = require('./intervention/intervention.model');
var auth = require('../../auth/auth.service');
var _ = require('lodash');

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

function createNameAndSchoolPromise(results) {
  return new Promise(function(resolve, reject) {
    var promises = _.map(results, function(result) {
      return new Promise(function(resolve, reject) {
        function getTotals() {
          var records = this.records;
          var typeArr = _.map(records, 
              function(rec) { return rec.type 
            });
          return _.countBy(typeArr, _.identity);
        }
        School.findById(result.school, 
          function(err, school) {
            if (err) reject(err);
            result.school = school;
          })
          .then(function() {
            Student.findById(result.student, 
              function(err, student) {
              if (err) reject(err);
              result.student = student;
            })
          .then(function() {
            result.totals = getTotals.call(result);
            resolve(result);
          });
        });
      });
    });
    Promise.all(promises).then(
      function(val) { 
        resolve(val);
    });
  });
}

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
      _id: {student: '$student', school: '$school'},
      records: { $addToSet: '$$ROOT' }
    } 
  }, {
    $project: {
      _id: 0,
      school: '$_id.school',
      student: '$_id.student',
      records: {
        type: 1,
        tier: 1,
        absences: 1,
        record: 1,
        schoolYear: 1,
        triggerDate: 1,
        actionDate: 1
      }
    }
  }];
  if(req.user.role === 'teacher') {
    pipeline.push({ 
      $match: { school: req.user.assignment } 
    });
  }
  Outreach.aggregate(pipeline, function(err, results) {
    if (err) handleError(res, err);
    var updated = createNameAndSchoolPromise(results);
    updated.then(function(result) {
      return res.status(200).json(result);
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
    $group: {
      _id: {student: '$student', school: '$school' },
      records: { $push: '$$ROOT' }
    } 
  }, {
    $project: {
      _id: 0,
      student: '$_id.student',
      school: '$_id.school',
      // Might need some fine tuning if implemented
      records: 1
    }
  }];
  if(req.user.role === 'teacher') {
    pipeline.push({ 
      $match: { school: req.user.assignment } 
    });
  }
  Intervention.aggregate(pipeline, function(err, results) {
    if (err) handleError(res, err);
    var updated = createNameAndSchoolPromise(results);
    updated.then(function(updated) {
      return res.status(200).json(updated);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
