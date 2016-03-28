'use strict';

var _ = require('lodash');
var auth = require('../../../auth/auth.service');
var Outreach = require('./outreach.model');

/**
 * Get list of outreaches for a student.
 * restriction: 'teacher'
 */
exports.index = function(req, res) {
  Outreach.find({student: req.student.id}, function(err, outreaches) {
    if (err) return handleError(res, err);
    return res.status(201).json(outreaches);
  });
};

/**
 * Add a note to an outreach.
 * restriction: 'teacher'
 */
exports.addNote = function(req, res) {
  Outreach.findById(req.params.outreachId, function(err, outreach) {
    if (err) return handleError(res, err);
    if (!outreach) return res.status(404).send('Not Found');
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
  Outreach.findById(req.params.outreachId, function(err, outreach) {
    if (err) return handleError(res, err);
    if (!outreach) return res.status(404).send('Not Found');
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
