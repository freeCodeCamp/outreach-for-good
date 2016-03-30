'use strict';

var _ = require('lodash');
var School = require('./school.model');
var Student = require('../student/student.model');

/**
 * Get a list of schools
 * restriction: 'teacher'
 *
 * Returns a list of schools based on the req user role:
 * - teachers will get a list containing the assignment school
 * - manager+ will get a list of all schools
 */
exports.index = function(req, res) {
  var options = {};
  if (req.user.role === 'teacher') {
    options._id = req.user.assignment;
  }
  School.find(options).exec(function(err, schools) {
    if (err) return handleError(res, err);
    return res.status(200).json(schools);
  });
};

/**
 * Get a single school
 * restriction: 'teacher'
 */
exports.show = function(req, res) {
  return res.status(200).json(req.school);
};

/**
 * Creates a new school in the DB.
 * restriction: 'admin'
 */
exports.create = function(req, res) {
  School.create(req.body, function(err, school) {
    if (err) return handleError(res, err);
    return res.status(201).json(school);
  });
};

/**
 * Updates an existing school's triggers in the DB.
 * restriction: 'teacher'
 */
exports.updateTriggers = function(req, res) {
  req.school.triggers = req.body.triggers;
  req.school.save(function(err) {
    if (err) return handleError(res, err);
    return res.status(200).json(req.school);
  });
};

/**
 * Archives a school and it's students.
 * restriction: 'admin'
 */
exports.archive = function(req, res) {
  var school = req.school;
  school.archived = true;
  school.save(function(err) {
    if (err) handleError(res, err);
    Student.update({currentSchool: school.id},
      {active: false},
      {multi: true},
      function(err, raw) {
        if (err) return handleError(res, err);
        return res.status(200).json({
          name: school.name,
          modified: raw.nModified
        });
      });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
