'use strict';

var _ = require('lodash');
var auth = require('../../auth/auth.service');
var Outreach = require('./outreach.model');
var Student = require('../student/student.model');

/**
 * Creates an outreach in the DB.
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
    Outreach.create(req.body, function(err, outreach) {
      if (err) return handleError(res, err);
      return res.status(201).json(outreach);
    });
  });
};

/**
 * Add a note to an existing outreach.
 * restriction: 'teacher'
 */
exports.createNote = function(req, res) {
  Outreach
    .findById(req.params.id)
    .populate('student')
    .exec(function(err, outreach) {
      if (err) return handleError(res, err);
      if (!outreach) return res.status(404).send('Not Found');
      if (!auth.authorizeStudent(outreach.student, req)) {
        return res.status(403).json({
          reason: auth.schoolMsg(req.user.assignment || 'None')
        });
      }
      outreach.notes.push({
        user: req.user.id,
        note: req.body.note
      });
      outreach.save(function(err) {
        if (err) return handleError(res, err);
        Outreach.populate(outreach, {path: 'notes.user'},
          function(err, outreach) {
            if (err) return handleError(res, err);
            return res.status(200).json(outreach);
          });
      });
    });
};

exports.updateArchived = function(req, res) {
  Outreach
    .findById(req.params.id)
    .populate('student')
    .exec(function(err, outreach) {
      if (err) return handleError(res, err);
      if (!outreach) return res.send(404);
      if (!auth.authorizeStudent(outreach.student, req)) {
        return res.status(403).json({
          reason: auth.schoolMsg(req.user.assignment || 'None')
        });
      }
      outreach.archived = req.body.archived;
      outreach.save(function(err) {
        if (err) return handleError(res, err);
        return res.status(200).json(outreach);
      });
    });
};

exports.delete = function(req, res) {
  Outreach
    .findById(req.params.id)
    .populate('student')
    .exec(function(err, outreach) {
      if (err) return handleError(res, err);
      if (!outreach) return res.send(404);
      if (!auth.authorizeStudent(outreach.student, req)) {
        return res.status(403).json({
          reason: auth.schoolMsg(req.user.assignment || 'None')
        });
      }
      outreach.remove(function(err) {
        if (err) return handleError(res, err);
        return res.status(204).send('No Content');
      });
    });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
