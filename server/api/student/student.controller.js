'use strict';

var _ = require('lodash');
var Student = require('./student.model');
var Intervention = require('../intervention/intervention.model');
var auth = require('../../auth/auth.service');

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
  Student
    .findById(req.params.id)
    .populate('currentSchool', 'name')
    .lean()
    .exec(function(err, student) {
      if (err) return handleError(res, err);
      if (!student) return res.send(404);
      if (!auth.authorizeStudent(student, req)) {
        return res.status(403).json({
          reason: auth.studentMsg(student, req)
        });
      }
      Intervention
        .find({student: req.params.id})
        .exec(function(err, interventions) {
          student.interventions = interventions;
          return res.status(200).json(student);
        });
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
