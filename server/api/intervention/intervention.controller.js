'use strict';

var _ = require('lodash');
var auth = require('../../auth/auth.service');
var Intervention = require('./intervention.model');

/**
 * Get current unmarked intervention counts.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get intervention counts for assignment school
 * - manager+ will get intervention counts for all schools
 */
exports.current = function(req, res) {
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
  Intervention.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    return res.status(200).json(results);
  });
};

/**
 * Add a note to an intervention.
 * restriction: 'teacher'
 */
exports.addNote = function(req, res) {
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
        return res.status(200).json(intervention);
      });
    });
};

/**
 * Update actionDate for an intervention.
 * restriction: 'teacher'
 */
exports.updateAction = function(req, res) {
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
      intervention.actionDate = req.body.actionDate;
      intervention.save(function(err) {
        if (err) return handleError(res, err);
        return res.status(200).json(intervention);
      });
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
