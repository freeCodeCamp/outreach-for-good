'use strict';

var Setting = require('./setting.model');

/**
 * Get list of setting names.
 * restriction: 'teacher'
 *
 * Returns a list of setting names based on the req user role:
 * - teachers will get a list containing the assignment setting
 * - manager+ will get a list of all settings
 */
exports.names = function(req, res) {
  var options = {};
  if (req.user.role === 'teacher') {
    options._id = req.user.assignment;
  }
  Setting.find(options).select('name').exec(function(err, settings) {
    if (err) return handleError(res, err);
    return res.status(200).json(settings);
  });
};

/**
 * Creates a new setting in the DB.
 * restriction: 'admin'
 */
exports.create = function(req, res) {
  Setting.create(req.body, function(err, setting) {
    if (err) return handleError(res, err);
    return res.status(201).json(setting);
  });
};

/**
 * Updates an existing setting's triggers in the DB.
 * restriction: 'teacher'
 */
exports.updateTriggers = function(req, res) {
  req.setting.triggers = req.body.triggers;
  req.setting.save(function(err) {
    if (err) return handleError(res, err);
    return res.status(200).json(req.setting);
  });
};

/**
 * Destructive delete of a setting and all related records and students.
 *
 * This delete calls student.remove and cascades deletes interventions,
 * outreaches, and notes for those students.
 *
 * restriction: 'admin'
 */
exports.delete = function(req, res) {
  var setting = req.setting;
  setting.remove(function(err) {
    if (err) handleError(res, err);
    return res.status(204).send('No Content');
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
