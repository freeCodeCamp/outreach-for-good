'use strict';

var User = require('./user.model');
var School = require('../school/school.model');
var passport = require('passport');
var auth = require('../../auth/auth.service');

/**
 * Get my info
 */
exports.me = function(req, res) {
  User.findById(req.user.id)
    .populate('assignment')
    .exec(function(err, user) {
      if (err) return handleError(res, err);
      if (!user) return res.status(401).send('Unauthorized');
      return res.status(200).json(user);
    });
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  User.findById(req.params.userId, function(err, user) {
    if (err) return handleError(res, err);
    if (!user) return res.status(401).send('Unauthorized');
    return res.status(200).json(user.profile);
  });
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find()
    .populate('assignment', 'name')
    .sort({name: 1})
    .exec(function(err, users) {
      if (err) return handleError(res, err);
      return res.status(200).json(users);
    });
};

/**
 * A user can only assign equal or lower roles to other users.
 */
exports.validateUpdateRole = function(req, res, next) {
  return auth.hasRole(req.body.role)(req, res, next);
};

/**
 * Change a user's role.
 * restriction: 'admin'
 */
exports.updateRole = function(req, res) {
  var paramUser = req.paramUser;
  paramUser.role = req.body.role;
  paramUser.assignment = undefined;
  paramUser.save(function(err, user) {
    if (err) return handleError(res, err);
    return res.status(200).json(user);
  });
};

/**
 * Check that assignment exists.
 */
exports.validateUpdateAssignment = function(req, res, next) {
  School.findById(req.body.assignment, function(err, school) {
    if (err) return handleError(res, err);
    if (!school) {
      return next(new Error('Assignment is not a valid School.'));
    }
    req.school = school;
    return next();
  });
};

/**
 * Change a user's assigned school.
 * restriction: 'admin'
 */
exports.updateAssignment = function(req, res) {
  var paramUser = req.paramUser;
  paramUser.assignment = req.school._id;
  paramUser.save(function(err, user) {
    if (err) return handleError(res, err);
    user.populate('assignment', 'name', function(err, user) {
      if (err) return handleError(res, err);
      return res.status(200).json(user);
    });
  });
};

/**
 * A user can only delete users with equal or lower roles.
 */
exports.validateDelete = function(req, res, next) {
  return auth.hasRole(req.paramUser.role)(req, res, next);
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.delete = function(req, res) {
  req.paramUser.remove(function(err) {
    if (err) return handleError(res, err);
    return res.status(204).send('No Content');
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
  return res.redirect('/');
};

function handleError(res, err) {
  return res.status(500).send(err);
}
