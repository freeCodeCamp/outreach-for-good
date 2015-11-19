'use strict';

var _ = require('lodash');
var pdf2table = require('pdf2table');
var fs = require('fs');
var AbsenceRecord = require('../absence-record/absence-record.model');

// Returns an array of arrays, each nested array represents data for a student.
function studentDataArrays(rows) {
  var rowChunks = _.chunk(rows.reverse(), 6);
  return [].concat.apply([], _.map(rowChunks, splitRowChunks));
}

// Splits each row of three students into an array for each student.
function splitRowChunks(rows) {
  var propertyArrays = _.map(rows, function(row) {
    return _.chunk(row, 2);
  });
  return _.zip.apply(null, propertyArrays);
}

function parseStudent(arr) {
  var result = {};
  var names = arr[0][0].split(', ');
  result.student = {
    lastName: names[0],
    firstName: names[1],
    studentId: arr[0][1]
  };
  result.entry = {
    absences: +arr[1][1],
    tardies: +arr[2][1],
    present: +arr[3][1],
    enrolled: +arr[4][1]
  };
  result.schoolYear = arr[5][1].replace(/\s/g, '');
  return result;
}

function previousRecord(schoolId, schoolYear) {
  return AbsenceRecord
    .findOne({school: schoolId, schoolYear: schoolYear})
    .sort({_id: -1})
    .populate('entries.student')
    .exec();
}

// Categorize students into update and create.
function groupByType(students, idToPrev) {
  return _.groupBy(students, function(student) {
    return student.student.studentId in idToPrev ? 'updates' : 'creates';
  });
}

exports.upload = function(req, res) {
  fs.readFile(req.file.path, function(err, buffer) {
    if (err) return handleError(res, err);
    pdf2table.parse(buffer, function(err, rows) {
      if (err) return handleError(res, err);

      // TODO: Try catch for failure to parse.
      var students = studentDataArrays(rows).map(parseStudent);
      // Needs authorization check if teacher, check if equal to assignment.
      var schoolId = req.body.schoolId;
      // This will throw if no students, add guard statement (invalid upload?).
      var schoolYear = students[0].schoolYear;

      previousRecord(schoolId, schoolYear).then(function(prev) {
        var idToPrev = _.indexBy((prev || {}).entries, 'student.studentId');
        var result = groupByType(students, idToPrev);
        if (result.updates) {
          _.forEach(result.updates, function(student) {
            var prevStudent = idToPrev[student.student.studentId].student;
            student.entry.student = prevStudent._id;
          });
        }
        result.missing =
          _.difference(_.keys(idToPrev), _.map(students, 'student.studentId'));
        res.status(200).json(result);
      });
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
