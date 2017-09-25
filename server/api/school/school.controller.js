'use strict';

var School = require('./school.model');

/**
 * Get list of schools.
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
 * Get list of school names.
 * restriction: 'teacher'
 *
 * Returns a list of school names based on the req user role:
 * - teachers will get a list containing the assignment school
 * - manager+ will get a list of all schools
 */
exports.names = function(req, res) {
  var options = {};
  if (req.user.role === 'teacher') {
    options._id = req.user.assignment;
  }
  School.find(options).select('name').exec(function(err, schools) {
    if (err) return handleError(res, err);
    return res.status(200).json(schools);
  });
};


/**
 * Get a single school.
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
 * Destructive delete of a school and all related records and students.
 *
 * This delete calls student.remove and cascades deletes interventions,
 * outreaches, and notes for those students.
 *
 * restriction: 'admin'
 */
exports.delete = function(req, res) {
  var school = req.school;
  school.remove(function(err) {
    if (err) handleError(res, err);
    return res.status(204).send('No Content');
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
