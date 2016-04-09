'use strict';

var User = require('./user.model');
var passport = require('passport');
var auth = require('../../auth/auth.service');

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find()
    .populate('assignment', 'name')
    .sort({name: 1})
    .exec(function(err, users) {
      if (err) return res.status(500).send(err);
      res.status(200).json(users);
    });
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function(err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Change a user's role.
 * restriction: 'admin'
 *
 * A user can only assign roles for users with equal or lower roles.
 * A user can only assign equal or lower roles to other users.
 */
exports.updateRole = function(req, res) {
  auth.hasRole(req.body.role)(req, res, function() {
    User.findById(req.params.id, function(err, user) {
      if (err) return res.status(500).send(err);
      auth.hasRole(user.role)(req, res, function() {
        user.role = req.body.role;
        user.assignment = undefined;
        user.save(function(err) {
          if (err) return res.status(500).send(err);
          res.json(user);
        });
      });
    });
  });
};

/**
 * Change a user's assigned school.
 * restriction: 'admin'
 */
exports.updateAssignment = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.status(500).send(err);
    user.assignment = req.body.assignment;
    user.save(function(err) {
      if (err) return res.status(500).send(err);
      user.populate('assignment', function() {
        res.json(user);
      });
    });
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 *
 * A user can only delete users with equal or lower roles.
 */
exports.destroy = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.status(500).send(err);
    auth.hasRole(user.role)(req, res, function() {
      user.remove(function(err) {
        if (err) return res.status(500).send(err);
        return res.status(204).send('No Content');
      });
    });
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User
    .findOne({_id: userId})
    .populate('assignment')
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) return res.status(401).send('Unauthorized');
      res.json(user);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
