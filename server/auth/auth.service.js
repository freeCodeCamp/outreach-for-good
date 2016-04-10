'use strict';

var _ = require('lodash');
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

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
exports.isAuthenticated = function() {
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
};

/**
 * Returns a jwt token signed by the app secret
 */
exports.signToken = function(id) {
  return jwt.sign({_id: id}, config.secrets.session, {expiresIn: '5h'});
};

/**
 * Set token cookie directly for oAuth strategies
 */
exports.setTokenCookie = function(req, res) {
  if (!req.user) {
    return res.status(404)
      .json({message: 'Something went wrong, please try again.'});
  }
  var token = exports.signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
};

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
exports.hasRole = function(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');
  return compose()
    .use(exports.isAuthenticated())
    .use(function(req, res, next) {
      if (meetsRoleRequirements(req.user.role, roleRequired)) {
        next();
      } else {
        res.status(403).json({reason: roleMsg(req.user.role, roleRequired)});
      }
    });
};

function schoolMsg(assignmentId) {
  return 'Your current role of teacher and assignment to schoolId: ' +
         assignmentId + ' does not allow access to requested resource.';
}

function managerOrAssignedSchool(schoolIdStr, user) {
  if (meetsRoleRequirements(user.role, 'manager')) return true;
  return schoolIdStr === user.assignment.toString();
}

/**
 * Attaches school object to request if user has is at least manager or
 * has assignment to school.
 */
exports.school = function(req, res, next) {
  School.findById(req.params.schoolId, function(err, school) {
    if (err) return handleError(res, err);
    if (!school) return res.sendStatus(404);
    if (!managerOrAssignedSchool(school.id, req.user)) {
      return res.status(403).json({
        reason: schoolMsg(req.user.assignment || 'None')
      });
    }
    req.school = school;
    next();
  });
};

function studentMsg(student, req) {
  return 'Your current role of teacher and assignment to schoolId: ' +
         req.user.assignment.toString() +
         ' does not allow access to student._id: ' + student._id + '.';
}

/**
 * Attaches student object to request if user has is at least manager or
 * has assignment to student's school..
 */
exports.student = function(req, res, next) {
  Student.findById(req.params.studentId, function(err, student) {
    if (err) return handleError(res, err);
    if (!student) return res.sendStatus(404);
    if (!managerOrAssignedSchool(student.school.toString(), req.user)) {
      return res.status(403).json({
        reason: studentMsg(student, req)
      });
    }
    req.student = student;
    next();
  });
};

/**
 * Check that user has role of manager or all students included in
 * req.body.studentIds are assigned to user.
 */
exports.studentBatch = function(req, res, next) {
  Student
    .find({_id: {$in: req.body.studentIds}})
    .exec(function(err, students) {
      if (err) return handleError(res, err);
      if (!meetsRoleRequirements(req.user.role, 'manager')) {
        var schools = _(students).map('school').uniq().value();
        if (schools.length > 1 || schools[0] !== req.user.assignment.id) {
          return next(new Error('Attempting to update students without ' +
                                'adequate role or assignment.'));
        }
      }
      req.students = students;
      return next();
    });
};

function recordMsg(record, req) {
  return 'Your current role of teacher and assignment to schoolId: ' +
         req.user.assignment.toString() +
         ' does not allow access to record._id: ' + record._id + '.';
}

/**
 * Attaches absence record object to request if user has is at least manager or
 * has assignment to absence record school.
 */
exports.record = function(req, res, next) {
  AbsenceRecord.findById(req.params.recordId, function(err, record) {
    if (err) return handleError(res, err);
    if (!record) return res.sendStatus(404);
    if (!managerOrAssignedSchool(record.school.toString(), req.user)) {
      return res.status(403).json({
        reason: recordMsg(record, req)
      });
    }
    req.record = record;
    next();
  });
};

function userMsg(paramUser, req) {
  return 'Your current role of ' + req.user.role +
         ' does not allow access to modify user._id: ' + paramUser._id + '.';
}

/**
 * Attaches user object from userId param to request if user has equal or
 * higher role.
 */
exports.modifyUser = function(req, res, next) {
  User.findById(req.params.userId, function(err, paramUser) {
    if (err) return handleError(res, err);
    if (!paramUser) return res.sendStatus(404);
    if (!meetsRoleRequirements(req.user.role, paramUser.role)) {
      return res.status(403).json({
        reason: userMsg(paramUser, req)
      });
    }
    req.paramUser = paramUser;
    next();
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
