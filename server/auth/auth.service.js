'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var AbsenceRecord = require('../api/absence-record/absence-record.model');
var User = require('../api/user/user.model');
var School = require('../api/school/school.model');
var Student = require('../api/student/student.model');
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

function schoolMsg(assignmentId) {
  return 'Your current role of teacher and assignment to schoolId: ' +
         assignmentId + ' does not allow access to requested resource.';
}

function managerOrAssignedSchool(school, user) {
  if (meetsRoleRequirements(user.role, 'manager')) return true;
  return school.id === user.assignment.id;
}

function school(req, res, next) {
  School.findById(req.params.schoolId, function(err, school) {
    if (err) return handleError(res, err);
    if (!school) return res.send(404);
    if (!managerOrAssignedSchool(school, req.user)) {
      return res.status(403).json({
        reason: schoolMsg(req.user.assignment || 'None')
      });
    }
    req.school = school;
    next();
  });
}

function studentMsg(student, req) {
  return 'Your current role of teacher and assignment to schoolId: ' +
         req.user.assignment.toString() +
         ' does not allow access to student._id: ' + student._id + '.';
}

function student(req, res, next) {
  Student.findById(req.params.studentId, function(err, student) {
    if (err) return handleError(res, err);
    if (!student) return res.send(404);
    if (!managerOrAssignedSchool(student.currentSchool, req.user)) {
      return res.status(403).json({
        reason: studentMsg(student, req)
      });
    }
    req.student = student;
    next();
  });
}

function recordMsg(record, req) {
  return 'Your current role of teacher and assignment to schoolId: ' +
         req.user.assignment.toString() +
         ' does not allow access to record._id: ' + record._id + '.';
}

function record(req, res, next) {
  AbsenceRecord.findById(req.params.recordId, function(err, record) {
    if (err) return handleError(res, err);
    if (!record) return res.send(404);
    if (!managerOrAssignedSchool(record.school, req.user)) {
      return res.status(403).json({
        reason: recordMsg(record, req)
      });
    }
    req.record = record;
    next();
  });
}

function handleError(res, err) {
  return res.send(500, err);
}

exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;

exports.hasRole = hasRole;
exports.school = school;
exports.student = student;
exports.record = record;
