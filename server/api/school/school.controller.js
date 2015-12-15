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
    options._id = req.user.assignment._id;
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
  School.findById(req.params.id, function(err, school) {
    if (err) { return handleError(res, err); }
    if (!school) { return res.status(404).send('Not Found'); }
    return res.json(school);
  });
};

/**
 * Get students for a school.
 * restriction: 'teacher'
 */
exports.students = function(req, res) {
  School.findById(req.params.id, function(err, school) {
    if (err) { return handleError(res, err); }
    if (!school) { return res.status(404).send('Not Found'); }
    Student
      .find({currentSchool: school})
      .populate('currentSchool', 'name')
      .exec(function(err, students) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(students);
      });
  });
};

/**
 * Creates a new school in the DB.
 * restriction: 'admin'
 */
exports.create = function(req, res) {
  School.create(req.body, function(err, school) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(school);
  });
};

/**
 * Updates an existing school in the DB.
 * restriction: 'admin'
 */
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }
  School.findById(req.params.id, function(err, school) {
    if (err) { return handleError(res, err); }
    if (!school) { return res.status(404).send('Not Found'); }
    var updated = _.merge(school, req.body);
    updated.save(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(school);
    });
  });
};

/**
 * Deletes a school from the DB.
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  School.findById(req.params.id, function(err, school) {
    if (err) { return handleError(res, err); }
    if (!school) { return res.status(404).send('Not Found'); }
    school.remove(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
