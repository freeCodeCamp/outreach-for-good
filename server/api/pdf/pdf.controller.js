'use strict';

var _ = require('lodash');
var pdf2table = require('pdf2table');
var fs = require('fs');
var AbsenceRecord = require('../absence-record/absence-record.model');
var Student = require('../student/student.model');

// Parse PDF report to readable JSON data
function parseStudents(block) {
  return _.chunk(block[0], 2).map(function(student, i) {
    var names = student[0].split(', ');
    return {
      last: names[0],
      first: names[1],
      id: student[1]
    };
  }).map(function(student, i) {
    student['All Absences'] = block[1][i * 2 + 1];
    student.Tdy = block[2][i * 2 + 1];
    student.Present = block[3][i * 2 + 1];
    student.Enrolled = block[4][i * 2 + 1];
    student['School Year'] = block[5][i * 2 + 1];
    return student;
  });
}

// Creates a new student record
// If student record exists, do nothing...
function createStudentRecords(records) {
  return records.map(function(record) {
    return {
      studentId: record.id,
      lastName: record.last,
      firstName: record.first,
      active: true
        // get school attr here
    };
  });
}

// Creates new Absence Record...
// If absence record exists, appends it
function createAbsenceRecord(records) {
  var absRecord = {
    schoolYear: records[0]['School Year'],
    // insert school attr here
  };
  absRecord.entries = records.map(function(record) {
    return {
      //get student ID here
      absences: record['All Absences'],
      tardies: record.Tdy,
      present: record.Present,
      enrolled: record.Enrolled
    };
  });
  return absRecord;
}

// Takes PDF Data and transfers it into the DB
exports.create = function(req, res) {

  fs.readFile(req.file.path, function(err, buffer) {
    if (err) return console.log(err);
    pdf2table.parse(buffer, function(err, rows) {
      if (err) return console.log(err);
      var results = _.chunk(rows.reverse(), 6).reduce(function(p, block) {
        return p.concat(parseStudents(block));
      }, []);
      var stuBatch = createStudentRecords(results);
      var absBatch = createAbsenceRecord(results);
      console.log(stuBatch);
      //Student.collection.insert(stuBatch, {ordered: false});
      console.log(absBatch);
      //AbsenceRecord.create(absBatch);
    });
  });
  res.status(204).end()
};

function handleError(res, err) {
  return res.send(500, err);
}