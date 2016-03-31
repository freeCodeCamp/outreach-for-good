'use strict';

var Student = require('./student.model');
var School = require('../school/school.model');
var Outreach = require('./outreach/outreach.model');
var Intervention = require('./intervention/intervention.model');
var auth = require('../../auth/auth.service');
var _ = require('lodash');

var populateOptions = {
  path: 'currentSchool',
  select: 'name'
};

/**
 * Get list of all students
 * restriction: 'manager'
 */
exports.index = function(req, res) {
  Student
    .find()
    .populate('currentSchool', 'name')
    .exec(function(err, students) {
      if (err) return handleError(res, err);
      return res.status(200).json(students);
    });
};

/**
 * Get single student by id
 * restriction: 'teacher'
 */
exports.show = function(req, res) {
  Student.populate(req.student, populateOptions, function(err, student) {
    if (err) return handleError(res, err);
    return res.status(200).json(student);
  });
};

// Updates an existing student's iep field.
exports.updateIEP = function(req, res) {
  Student.populate(req.student, populateOptions, function(err, student) {
    if (err) return handleError(res, err);
    student.iep = req.body.iep;
    student.save(function(err) {
      if (err) return handleError(res, err);
      return res.status(200).json(student);
    });
  });
};

// Updates an existing student's cfa field.
exports.updateCFA = function(req, res) {
  Student.populate(req.student, populateOptions, function(err, student) {
    if (err) return handleError(res, err);
    student.cfa = req.body.cfa;
    student.save(function(err) {
      if (err) return handleError(res, err);
      return res.status(200).json(student);
    });
  });
};

/**
 * Get current outstanding outreach counts.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get outreach counts for assignment school
 * - manager+ will get outreach counts for all schools
 */
exports.outreachCounts = function(req, res) {
  var pipeline = [{
    $match: {actionDate: null}
  }, {
    $group: {
      _id: '$type',
      count: {$sum: 1}
    }
  }];
  if (req.user.role === 'teacher') {
    pipeline[0].$match.school = req.user.assignment;
  }
  Outreach.aggregate(pipeline, function(err, results) {
    if (err) return handleError(res, err);
    return res.status(200).json(results);
  });
};

function createAddNamesPromises(results) {
  // Returns an array of school outreach/intervention
  // summary records with school and student names
  return _.map(results, function(school) {
    return new Promise(function(resolve, reject) {
      // Promise returns a school name 
      var getSchool = new Promise(function(resolve,reject) {
        School.findById(school._id, function(err, res) {
          if (err) reject(err);
          resolve(res.name);
        });
      });
      // Promise returns student name to record object
      var getNames = new Promise(function(resolve, reject) {
        var getNamesPromise = _.map(school.records, 
          function(record) { 
            return new Promise(function(resolve, reject) {
              Student.findById(record.student, function(err, res) {
                if (err) reject(err);
                record.student = {
                  firstName: res.firstName,
                  lastName: res.lastName,
                  studentId: res.studentId,
                  _id: res._id
                }
                resolve(record);
              });
            });
          });
        Promise.all(getNamesPromise)
          .then(function(newRecords) {
            resolve(newRecords);
          });      
      });
      // Promise below brings everything together,
      //  executing getSchool, and getNames, then
      //  setting resolved values to attribute in
      //  school intervention summary record.
      Promise.all([getSchool, getNames])
        .then(function(val) {
          school.schoolName = val[0];
          school.records = val[1];
          resolve(school);
        });
    });
  });
}

exports.interventionSummary = function(req, res) {
  var pipeline = [{
    $group: {
      _id: {student: '$student', school: '$school' },
      records: { $push: '$$ROOT' }
    } 
  }, {
    $group: {
      _id: '$_id.school',
      records: {
        $addToSet: {
          student: '$_id.student',
          interventions: '$records._id'
        }
      }
    }
  }];
  Intervention.aggregate(pipeline, function(err, results) {
    if (err) handleError(res, err);
    var addNamesPromises = createAddNamesPromises(results);
    Promise.all(addNamesPromises).then(
      function(updated) {
        return res.status(200).json(updated);
      });
  });
};

exports.outreachSummary = function(req, res) {
  var pipeline = [{
    $group: {
      _id: {student: '$student', school: '$school' },
      records: { $push: '$$ROOT' }
    } 
  }, {
    $group: {
      _id: '$_id.school',
      records: {
        $addToSet: {
          student: '$_id.student',
          outreaches: '$records'
        }
      }
    }
  }, {
    $project: {
      'records.student': 1,
      'records.outreaches._id': 1,     
      'records.outreaches.type': 1,     
      'records.outreaches.tier': 1,     
      'records.outreaches.absences': 1,     
      'records.outreaches.triggerDate': 1,     
      'records.outreaches.actionDate': 1     
    }
  }];
  Outreach.aggregate(pipeline, function(err, results) {
    if (err) handleError(res, err);
    var addNamesPromises = createAddNamesPromises(results);
    Promise.all(addNamesPromises).then(
      function(updated) {
        return res.status(200).json(updated);
      });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
