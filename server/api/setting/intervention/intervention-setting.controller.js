'use strict';

var Setting = require('../setting.model');

/**
 * Get list of intervention types.
 * restriction: 'teacher'
 *
 * Returns an array of intervention types for use in a dropdown.
 *   - [_id, title, description, active]
 */
exports.types = function(req, res) {
  var options = {};
  Setting.find(options).exec(function(err, setting) {
    if (err) return handleError(res, err);
    return res.status(200).json(setting[0].intervention.types);
  });
};

/**
 * Adds a new intervention type to the database
 *   - expects body: {title: xx, description: xx}
 * restriction: 'admin'
 */
exports.create = function(req, res) {
  console.log(req.body)
  Setting.findOneAndUpdate({"name": "settings"},
    {$push: {"intervention.types": req.body}},
    function(err, setting) {
    if (err) return handleError(res, err);
    return res.status(201).json(setting);
  });
};

/**
 * Remove an intervention type from the database
 * restriction: 'admin'
 */
exports.delete = function(req, res) {
  Setting.findOneAndUpdate({"name": "settings"},
    {$pull: {"intervention.types": {"_id": req.params.typeId}}},
    function(err, setting) {
    if (err) return handleError(res, err);
    return res.status(201).json(setting);
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
