'use strict';

var _ = require('lodash');
var auth = require('../../auth/auth.service');
var Intervention = require('./intervention.model');

// Get list of interventions
exports.index = function(req, res) {
  Intervention.find(function(err, interventions) {
    if (err) return handleError(res, err);
    return res.status(200).json(interventions);
  });
};


/**
 * Get current unmarked interventions.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get interventions for assignment school
 * - manager+ will get interventions for all schools
 */
exports.current = function(req, res) {
  var options = [{
    $match: {actionDate: null}
  }, {
    $group: {
      _id: '$type',
      count: {$sum: 1}
    }
  }];
  if (req.user.role === 'teacher') {
    options[0].$match.school = req.user.assignment;
  }
  Intervention.aggregate(options, function(err, results) {
    if (err) return handleError(res, err);
    return res.status(200).json(results);
  });
};

// Get a single intervention
exports.show = function(req, res) {
  Intervention.findById(req.params.id, function(err, intervention) {
    if (err) return handleError(res, err);
    if (!intervention) return res.status(404).send('Not Found');
    return res.status(200).json(intervention);
  });
};

// Creates a new intervention in the DB.
exports.create = function(req, res) {
  Intervention.create(req.body, function(err, intervention) {
    if (err) return handleError(res, err);
    return res.status(201).json(intervention);
  });
};

// Updates an existing intervention in the DB.
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }
  Intervention.findById(req.params.id, function(err, intervention) {
    if (err) return handleError(res, err);
    if (!intervention) return res.status(404).send('Not Found');
    var updated = _.merge(intervention, req.body);
    updated.save(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(intervention);
    });
  });
};

// Updates an existing intervention's actionDate in the DB.
exports.updateAction = function(req, res) {
  Intervention
    .findById(req.params.id)
    .populate('student')
    .exec(function(err, intervention) {
      if (err) return handleError(res, err);
      if (!intervention) return res.status(404).send('Not Found');
      if (!auth.meetsRoleRequirements(req.user.role, 'manager') &&
          req.user.assignment !== intervention.school) {
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


// Add a note to an intervention.
exports.addNote = function(req, res) {
  Intervention
    .findById(req.params.id)
    .populate('student')
    .exec(function(err, intervention) {
      if (err) return handleError(res, err);
      if (!intervention) return res.status(404).send('Not Found');
      if (!auth.meetsRoleRequirements(req.user.role, 'manager') &&
          req.user.assignment !== intervention.school) {
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

// Deletes a intervention from the DB.
exports.destroy = function(req, res) {
  Intervention.findById(req.params.id, function(err, intervention) {
    if (err) return handleError(res, err);
    if (!intervention) return res.status(404).send('Not Found');
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
