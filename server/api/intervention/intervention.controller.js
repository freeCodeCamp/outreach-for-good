'use strict';

var _ = require('lodash');
var Intervention = require('./intervention.model');

// Get list of interventions
exports.index = function(req, res) {
  Intervention.find(function(err, interventions) {
    if (err) return handleError(res, err);
    return res.status(200).json(interventions);
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
  return res.status(500).send(err);
}
