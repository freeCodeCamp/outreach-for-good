'use strict';

var _ = require('lodash');
var auth = require('../../auth/auth.service');
var Something = require('./something.model');

/**
 * Get current unmarked something counts.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get something counts for assignment school
 * - manager+ will get something counts for all schools
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
  Something.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    return res.status(200).json(results);
  });
};

/**
 * Add a note to an something.
 * restriction: 'teacher'
 */
exports.addNote = function(req, res) {
  Something
    .findById(req.params.id)
    .populate('student')
    .exec(function(err, something) {
      if (err) return handleError(res, err);
      if (!something) return res.status(404).send('Not Found');
      if (!auth.authorizeStudent(something.student, req)) {
        return res.status(403).json({
          reason: auth.schoolMsg(req.user.assignment || 'None')
        });
      }
      something.notes.push({
        user: req.user.id,
        note: req.body.note
      });
      something.save(function(err) {
        if (err) return handleError(res, err);
        Something.populate(something, {path: 'notes.user'},
          function(err, something) {
            if (err) return handleError(res, err);
            return res.status(200).json(something);
          });
      });
    });
};

/**
 * Update actionDate for an something.
 * restriction: 'teacher'
 */
exports.updateAction = function(req, res) {
  Something
    .findById(req.params.id)
    .populate('student')
    .exec(function(err, something) {
      if (err) return handleError(res, err);
      if (!something) return res.status(404).send('Not Found');
      if (!auth.authorizeStudent(something.student, req)) {
        return res.status(403).json({
          reason: auth.schoolMsg(req.user.assignment || 'None')
        });
      }
      something.actionDate = req.body.actionDate;
      something.save(function(err) {
        if (err) return handleError(res, err);
        return res.status(200).json(something);
      });
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
