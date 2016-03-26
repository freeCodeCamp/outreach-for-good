'use strict';

var _ = require('lodash');
var AbsenceRecord = require('../absence-record/absence-record.model');
var Intervention = require('../intervention/intervention.model');
var Outreach = require('../outreach/outreach.model');
var Student = require('./student.model');
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
  var result = {};
  Student
    .findById(req.params.id)
    .populate('currentSchool', 'name')
    .exec(function(err, data) {
      if (err) return handleError(res, err);
      if (!data) return res.send(404);
      if (!auth.authorizeStudent(data, req)) {
        return res.status(403).json({
          reason: auth.studentMsg(data, req)
        });
      }
      return data;
    })
    .then(function(student) {
      result.student = student;
      return Outreach
        .find({student: req.params.id})
        .populate('notes.user')
        .sort({_id: -1})
        .exec();
    })
    .then(function(outreaches) {
      result.outreaches = outreaches;
      return Intervention
        .find({student: req.params.id})
        .populate('notes.user')
        .sort({_id: -1})
        .exec();
    })
    .then(function(interventions) {
      result.interventions = interventions;
      return AbsenceRecord.findOne({
          school: result.student.currentSchool.id,
          'entries.student': result.student.id
        }, {
          schoolYear: 1,
          date: 1,
          entries: {
            $elemMatch: {student: result.student.id}
          }
        })
        .sort('-date')
        .exec();
    })
    .then(function(currentRecord) {
      result.currentRecord = currentRecord;
      return res.status(200).json(result);
    });
};

// Creates a new student in the DB.
exports.create = function(req, res) {
  Student.create(req.body, function(err, student) {
    if (err) return handleError(res, err);
    return res.json(201, student);
  });
};

// Updates an existing student's iep field.
exports.updateIEP = function(req, res) {
  Student.findById(req.params.id, function(err, student) {
    if (err) return handleError(res, err);
    if (!student) return res.send(404);
    if (!auth.authorizeStudent(student, req)) {
      return res.status(403).json({
        reason: auth.studentMsg(student, req)
      });
    }
    student.iep = req.body.iep;
    student.save(function(err) {
      if (err) return handleError(res, err);
      return res.status(200).json(student);
    });
  });
};

// Updates an existing student's cfa field.
exports.updateCFA = function(req, res) {
  Student.findById(req.params.id, function(err, student) {
    if (err) return handleError(res, err);
    if (!student) return res.send(404);
    if (!auth.authorizeStudent(student, req)) {
      return res.status(403).json({
        reason: auth.studentMsg(student, req)
      });
    }
    student.cfa = req.body.cfa;
    student.save(function(err) {
      if (err) return handleError(res, err);
      return res.status(200).json(student);
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
