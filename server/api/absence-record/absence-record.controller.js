'use strict';

var _ = require('lodash');
var AbsenceRecord = require('./absence-record.model');

/**
 * Get list of absence records
 * restriction: 'manager'
 */
exports.index = function(req, res) {
  AbsenceRecord.find(function(err, records) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(records);
  });
};

/**
 * Get a single absence record
 * restriction: 'teacher'
 */
exports.show = function(req, res) {
  AbsenceRecord.findById(req.params.id, function(err, record) {
    if (err) { return handleError(res, err); }
    if (!record) { return res.status(404).send('Not Found'); }
    return res.json(record);
  });
};

/**
 * Creates a new absence record in the DB.
 * restriction: 'teacher'
 */
exports.create = function(req, res) {
  AbsenceRecord.create(req.body, function(err, record) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(record);
  });
};

/**
 * Updates an existing absence record in the DB.
 * restriction: 'teacher'
 */
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }
  AbsenceRecord.findById(req.params.id, function(err, record) {
    if (err) { return handleError(res, err); }
    if (!record) { return res.status(404).send('Not Found'); }
    var updated = _.merge(record, req.body);
    updated.save(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(record);
    });
  });
};

/**
 * Deletes a absence record from the DB.
 * restriction: 'teacher'
 */
exports.destroy = function(req, res) {
  AbsenceRecord.findById(req.params.id, function(err, record) {
    if (err) { return handleError(res, err); }
    if (!record) { return res.status(404).send('Not Found'); }
    record.remove(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
