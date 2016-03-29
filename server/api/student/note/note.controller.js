'use strict';

var _ = require('lodash');
var Student = require('../student.model');
var StudentNote = require('./note.model');
var auth = require('../../../auth/auth.service');

/**
 * Get list of all notes for a student.
 * restriction: 'teacher'
 */
exports.index = function(req, res) {
  StudentNote
    .find({student: req.student.id})
    .populate('user')
    .sort({createdAt: -1})
    .exec(function(err, notes) {
      if (err) return handleError(res, err);
      return res.status(200).json(notes);
    });
};

/**
 * Get single note by id
 * restriction: 'teacher'
 */
exports.show = function(req, res) {
  StudentNote
    .findById(req.params.noteId)
    .populate('user')
    .exec(function(err, note) {
      if (err) return handleError(res, err);
      return res.status(200).json(note);
    });
};

// Creates a new note for student in the DB.
exports.create = function(req, res) {
  // Ignore everything sent but the note for security reasons.
  var newNote = {
    student: req.student.id,
    user: req.user.id,
    note: req.body.note
  };
  StudentNote.create(newNote, function(err, note) {
    if (err) return handleError(res, err);
    return res.status(200).json(note);
  });
};

// Updates a note from the DB.
exports.update = function(req, res) {
  StudentNote
    .findById(req.params.noteId)
    .populate('user')
    .exec(function(err, note) {
      if (err) return handleError(res, err);
      if (!note) return res.send(404);
      // NOTE: For now only allow update to archived.
      if (note.archived !== req.body.archived) {
        note.archived = req.body.archived;
        note.save(function(err) {
          if (err) return handleError(res, err);
          return res.status(200).json(note);
        });
      }
    });
};

// Deletes a note from the DB.
exports.destroy = function(req, res) {
  StudentNote.findById(req.params.noteId, function(err, note) {
    if (err) return handleError(res, err);
    if (!note) return res.send(404);
    note.remove(function(err) {
      if (err) return handleError(res, err);
      return res.sendStatus(204);
    });
  });
};

exports.auth = function(req, res, next) {
  Student.findById(req.params.id, function(err, student) {
    if (err) return handleError(res, err);
    if (!student) return res.send(404);
    if (!auth.authorizeStudent(student, req)) {
      return res.status(403).json({
        reason: auth.studentMsg(student, req)
      });
    }
    req.student = student;
    next();
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
