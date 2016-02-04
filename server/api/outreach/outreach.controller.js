'use strict';

var _ = require('lodash');
var auth = require('../../auth/auth.service');
var Outreach = require('./outreach.model');

// Get list of outreaches
exports.index = function(req, res) {
  Outreach.find(function(err, outreaches) {
    if (err) return handleError(res, err);
    return res.status(200).json(outreaches);
  });
};

// Get a single outreach
exports.show = function(req, res) {
  Outreach.findById(req.params.id, function(err, intervention) {
    if (err) return handleError(res, err);
    if (!intervention) return res.status(404).send('Not Found');
    return res.status(200).json(intervention);
  });
};

// Creates a new outreach in the DB.
exports.create = function(req, res) {
  Outreach.create(req.body, function(err, outreach) {
    if (err) return handleError(res, err);
    return res.status(201).json(outreach);
  });
};

// Updates an existing outreach in the DB.
exports.update = function(req, res) {
  if (req.body._id) delete req.body._id;
  Outreach.findById(req.params.id, function(err, outreach) {
    if (err) return handleError(res, err);
    if (!outreach) return res.status(404).send('Not Found');
    var updated = _.merge(outreach, req.body);
    updated.save(function(err) {
      if (err) return handleError(res, err);
      return res.status(200).json(outreach);
    });
  });
};

// Add a note to an outreach.
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
        return res.status(200).json(outreach);
      });
    });
};

// Deletes a outreach from the DB.
exports.destroy = function(req, res) {
  Outreach.findById(req.params.id, function(err, outreach) {
    if (err) return handleError(res, err);
    if (!outreach) return res.status(404).send('Not Found');
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
