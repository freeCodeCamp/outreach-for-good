'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({secret: config.secrets.session});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findById(req.user._id, function(err, user) {
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');

        req.user = user;
        next();
      });
    });
}

function meetsRoleRequirements(userRole, roleRequired) {
  var userRoles = config.userRoles;
  return userRoles.indexOf(userRole) >= userRoles.indexOf(roleRequired);
}

function roleMsg(userRole, roleRequired) {
  return "Your current role of " + userRole +
         " does not meet the minimum required role of " +
         roleRequired + " for the requested resource.";
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function(req, res, next) {
      if (meetsRoleRequirements(req.user.role, roleRequired)) {
        next();
      } else {
        res.status(403).json({reason: roleMsg(req.user.role, roleRequired)});
      }
    });
}

function schoolMsg(schoolName) {
  return 'Your current role of teacher and assignment to ' +
         schoolName + ' does not allow access to requested resource.';
}

/**
 * Checks if the user is at least manager role or has school assignment
 */
function schoolAuth() {
  return compose()
    .use(function(req, res, next) {
      if (!req.params.schoolId) {
        throw new Error('schoolAuth is for routes with schoolId param');
      }
      if (meetsRoleRequirements(req.user.role, 'manager') ||
          req.user.currentSchool.id === req.params.schoolId) {
        next()
      } else {
        res.status(403).json({reason: schoolMsg(req.user.currentSchool.name)});
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({_id: id}, config.secrets.session, {expiresIn: 60 * 5});
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(404)
      .json({message: 'Something went wrong, please try again.'});
  }
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.schoolAuth = schoolAuth;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
