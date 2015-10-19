'use strict';

var _ = require('lodash');
var AbsenceRecord = require('./absence_record.model');

/**
 * Get list of absence_records
 * restriction: 'manager'
 */
exports.index = function(req, res) {
  AbsenceRecord.find(function(err, absence_records) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(absence_records);
  });
};

/**
 * Get a single absence_record
 * restriction: 'teacher'
 */
exports.show = function(req, res) {
  AbsenceRecord.findById(req.params.id, function(err, absence_record) {
    if (err) { return handleError(res, err); }
    if (!absence_record) { return res.status(404).send('Not Found'); }
    return res.json(absence_record);
  });
};

/**
 * Creates a new absence_record in the DB.
 * restriction: 'teacher'
 */
exports.create = function(req, res) {
  AbsenceRecord.create(req.body, function(err, absence_record) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(absence_record);
  });
};

/**
 * Updates an existing absence_record in the DB.
 * restriction: 'teacher'
 */
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }
  AbsenceRecord.findById(req.params.id, function(err, absence_record) {
    if (err) { return handleError(res, err); }
    if (!absence_record) { return res.status(404).send('Not Found'); }
    var updated = _.merge(absence_record, req.body);
    updated.save(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(absence_record);
    });
  });
};

/**
 * Deletes a absence_record from the DB.
 * restriction: 'teacher'
 */
exports.destroy = function(req, res) {
  AbsenceRecord.findById(req.params.id, function(err, absence_record) {
    if (err) { return handleError(res, err); }
    if (!absence_record) { return res.status(404).send('Not Found'); }
    absence_record.remove(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
