'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({secret: config.secrets.session});

var schoolIdForType = {
  body: function(req) {
    return req.body.schoolId;
  },
  params: function(req) {
    return req.params.schoolId;
  }
};

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  var composed = compose();
  // Validate jwt
  composed.use(function(req, res, next) {
    // allow access_token to be passed through query parameter as well
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }
    validateJwt(req, res, next);
  });
  // Attach user to request
  composed.use(function(req, res, next) {
    User.findById(req.user._id, function(err, user) {
      if (err) return next(err);
      if (!user) return res.status(401).send('Unauthorized');
      req.user = user;
      next();
    });
  });
  return composed;
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({_id: id}, config.secrets.session, {expiresIn: '5h'});
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

function schoolMsg(schoolId) {
  return 'Your current role of teacher and assignment to schoolId: ' +
         schoolId + ' does not allow access to requested resource.';
}

/**
 * Middleware that checks if user is at least manager or is assigned to school.
 *
 * @param type Indicates where to look for the school id for authorization.
 */
function authorizeSchool(type) {
  if (!schoolIdForType.hasOwnProperty(type))
    throw new Error('Valid type needs to be set for authorizeSchool function.');

  return compose()
    .use(function(req, res, next) {
      var assignment = req.user.assignment;
      if (meetsRoleRequirements(req.user.role, 'manager') ||
          assignment && schoolIdForType[type](req) &&
          schoolIdForType[type](req) === assignment.toString()) {
        next();
      } else {
        res.status(403).json({
          reason: schoolMsg(assignment || 'None')
        });
      }
    });
}

function studentMsg(student, req) {
  return 'Your current role of teacher and assignment to schoolId: ' +
         req.user.assignment.toString() +
         ' does not allow access to student._id: ' + student.id + '.';
}

function authorizeStudent(student, req) {
  return meetsRoleRequirements(req.user.role, 'manager') ||
         student.currentSchool.id === req.user.assignment.toString();
}

exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;

exports.hasRole = hasRole;
exports.authorizeSchool = authorizeSchool;
exports.authorizeStudent = authorizeStudent;

exports.meetsRoleRequirements = meetsRoleRequirements;

exports.studentMsg = studentMsg;
exports.schoolMsg = schoolMsg;
