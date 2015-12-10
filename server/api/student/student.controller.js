'use strict';

var _ = require('lodash');
var Student = require('./student.model');

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

/** TODO: Refactor school auth into its own service to keep DRY. **/
function schoolMsg(schoolId) {
  return 'Your current role of teacher and assignment to schoolId: ' +
         schoolId + ' does not allow access to requested resource.';
}

/**
 * Get single student by id
 * restriction: 'teacher'
 */
exports.show = function(req, res) {
  Student
    .findById(req.params.id)
    .populate('currentSchool', 'name')
    .exec(function(err, student) {
      if (err) return handleError(res, err);
      if (!student) return res.send(404);
      if (req.user.role === 'teacher' &&
          student.currentSchool.id !== req.user.assignment.toString()) {
        return res.status(403).json({
          reason: schoolMsg(req.user.assignment.toString())
        });
      }
      return res.json(student);
    });
};

// Creates a new student in the DB.
exports.create = function(req, res) {
  Student.create(req.body, function(err, student) {
    if (err) return handleError(res, err);
    return res.json(201, student);
  });
};

// Updates an existing student in the DB.
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }
  Student.findById(req.params.id, function(err, student) {
    if (err) return handleError(res, err);
    if (!student) return res.send(404);
    var updated = _.merge(student, req.body);
    updated.save(function(err) {
      if (err) return handleError(res, err);
      return res.json(200, student);
    });
  });
};

// Deletes a student from the DB.
exports.destroy = function(req, res) {
  Student.findById(req.params.id, function(err, student) {
    if (err) return handleError(res, err);
    if (!student) return res.send(404);
    student.remove(function(err) {
      if (err) return handleError(res, err);
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
