'use strict';

var _ = require('lodash');
var auth = require('../../auth/auth.service');
var Intervention = require('./intervention.model');
var Student = require('../student/student.model');

/**
 * Creates an intervention in the DB.
 * restriction: 'teacher'
 */
exports.create = function(req, res) {
  Student.findById({_id: req.body.student}).exec(function(err, student) {
    if (err) return handleError(res, err);
    if (!auth.authorizeStudent(student, req)) {
      return res.status(403).json({
        reason: auth.schoolMsg(req.user.assignment || 'None')
      });
    }
    Intervention.create(req.body, function(err, intervention) {
      if (err) return handleError(res, err);
      return res.status(201).json(intervention);
    });
  });
};

/**
 * Add a note to an existing intervention.
 * restriction: 'teacher'
 */
exports.createNote = function(req, res) {
  Intervention
    .findById(req.params.id)
    .populate('student')
    .exec(function(err, intervention) {
      if (err) return handleError(res, err);
      if (!intervention) return res.status(404).send('Not Found');
      if (!auth.authorizeStudent(intervention.student, req)) {
        return res.status(403).json({
          reason: auth.schoolMsg(req.user.assignment || 'None')
        });
      }
      intervention.notes.push({
        user: req.user.id,
        note: req.body.note
      });
      intervention.save(function(err) {
        if (err) return handleError(res, err);
        Intervention.populate(intervention, {path: 'notes.user'},
          function(err, intervention) {
            if (err) return handleError(res, err);
            return res.status(200).json(intervention);
          });
      });
    });
};

exports.updateArchived = function(req, res) {
  Intervention
    .findById(req.params.id)
    .populate('student')
    .exec(function(err, intervention) {
      if (err) return handleError(res, err);
      if (!intervention) return res.send(404);
      if (!auth.authorizeStudent(intervention.student, req)) {
        return res.status(403).json({
          reason: auth.schoolMsg(req.user.assignment || 'None')
        });
      }
      intervention.archived = req.body.archived;
      intervention.save(function(err) {
        if (err) return handleError(res, err);
        return res.status(200).json(intervention);
      });
    });
};

exports.delete = function(req, res) {
  Intervention
    .findById(req.params.id)
    .populate('student')
    .exec(function(err, intervention) {
      if (err) return handleError(res, err);
      if (!intervention) return res.send(404);
      if (!auth.authorizeStudent(intervention.student, req)) {
        return res.status(403).json({
          reason: auth.schoolMsg(req.user.assignment || 'None')
        });
      }
      intervention.remove(function(err) {
        if (err) return handleError(res, err);
        return res.status(204).send('No Content');
      });
    });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
