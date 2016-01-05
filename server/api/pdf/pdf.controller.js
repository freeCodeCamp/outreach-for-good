'use strict';

var _ = require('lodash');
var pdf2table = require('pdf2table');
var fs = require('fs');
var AbsenceRecord = require('../absence-record/absence-record.model');
var School = require('../school/school.model');

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

function createInterventions(entry, prevEntry, school, schoolYear) {
  var delta = entry.tardiesDelta + entry.absencesDelta;
  if (!delta) return [];

  var prevTotal = prevEntry.tardies || 0 + prevEntry.absences || 0;
  var currentTotal = prevTotal + delta;
  return _(school.triggers)
    .filter(function(trigger) {
      return trigger.absences > prevTotal && trigger.absences <= currentTotal;
    })
    .map(function(trigger) {
      return {
        type: trigger.type,
        tier: trigger.tier,
        absences: trigger.absences,
        student: entry.student,
        school: school.id,
        schoolYear: schoolYear
      }
    })
    .value();
}

function parsePDF(buffer, school, res) {
  pdf2table.parse(buffer, function(err, rows) {
    if (err) return handleError(res, err);
    // TODO: Try catch for failure to parse.
    var students = studentDataArrays(rows).map(parseStudent);
    // This will throw if no students, add guard statement (invalid upload?).
    var schoolYear = students[0].schoolYear;

    previousRecord(school.id, schoolYear).then(function(prev) {
      var idToPrev = _.indexBy((prev || {}).entries, 'student.studentId');
      var result = groupByType(students, idToPrev);
      // Deltas are equal to their entry counterpart minus previous entry
      // total for students with existing records.
      _.forEach(result.updates || [], function(student) {
        var entry = student.entry;
        var prevEntry = idToPrev[student.student.studentId];
        entry.student = prevEntry.student._id;
        entry.tardiesDelta = entry.tardies - prevEntry.tardies;
        entry.absencesDelta = entry.absences - prevEntry.absences;
        entry.interventions =
          createInterventions(entry, prevEntry, school, schoolYear);
      });
      // Deltas are equal to their entry counterpart if creating new student.
      _.forEach(result.creates || [], function(student) {
        var entry = student.entry;
        entry.tardiesDelta = entry.tardies;
        entry.absencesDelta = entry.absences;
        entry.interventions =
          createInterventions(entry, {}, school, schoolYear);
      });
      result.missing =
        _.difference(_.keys(idToPrev), _.map(students, 'student.studentId'));
      result.schoolId = school.id;
      res.status(200).json(result);
    });
  });
}

exports.upload = function(req, res) {
  fs.readFile(req.file.path, function(err, buffer) {
    if (err) return handleError(res, err);
    School.findById(req.body.schoolId, function(err, school) {
      if (err) return handleError(res, err);
      parsePDF(buffer, school, res);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
