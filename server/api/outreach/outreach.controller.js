'use strict';

var _ = require('lodash');
var auth = require('../../auth/auth.service');
var Outreach = require('./outreach.model');

/**
 * Get current unmarked outreach counts.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get outreach counts for assignment school
 * - manager+ will get outreach counts for all schools
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
  Outreach.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    return res.status(200).json(results);
  });
};

/**
 * Add a note to an outreach.
 * restriction: 'teacher'
 */
exports.addNote = function(req, res) {
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

/**
 * Update actionDate for an outreach.
 * restriction: 'teacher'
 */
exports.updateAction = function(req, res) {
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
      outreach.actionDate = req.body.actionDate;
      outreach.save(function(err) {
        if (err) return handleError(res, err);
        return res.status(200).json(outreach);
      });
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
