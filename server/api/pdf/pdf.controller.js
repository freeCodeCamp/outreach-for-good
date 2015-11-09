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
    student['School Year'] = student['School Year'].replace(/\s/g, '');
    return student;
  });
}

// Filters new students
function filterNewStudents(records, schoolId) {
  Student.find(function(err, students) {

    var curStudents = _.pluck(students, 'studentId');
    var incStudents = _.pluck(records, 'id');
    var finalList = _.difference(incStudents, curStudents);
    var result = [];

    _.forEach(finalList, function(id, key) {
      _.forEach(records, function(record, key) {
        if(record.id === id) {
          result.push({
            studentId: record.id,
            lastName: record.last,
            firstName: record.first,
            active: true,
            currentSchool: schoolId
          });
        };
      });
    });
    console.log(result);
    Student.collection.insert(result, {ordered: true});
  });

  AbsenceRecord.find({
    school: schoolId, 
    schoolYear: records[0]['School Year'] 
  },function(err, record) {
    if(record.length === 0) { 
      console.log('create new absencerecord');
      AbsenceRecord.create({
        schoolYear: records[0]['School Year'],
        school: schoolId
      }, function(err, newRecord) {
        console.log(newRecord)
        record[0] = newRecord;
      })
    }
  
    var newEntries = [];
    Student.find(function(err,students) {
      var studentList = _.map(students, function(student) {
        {return  _.pick(student, '_id', 'studentId'); } 
      });
      _.forEach(records, function(record, idx) {
        _.forEach(studentList, function(student, i) {
          if(studentList[i].studentId === records[idx].id) {
            newEntries.push({
              student: studentList[i]._id,
              absences: record['All Absences'],
              tardies: record.Tdy,
              present: record.Present,
              enrolled: record.Enrolled
            });
          };
        });
      });
      AbsenceRecord.findById(record[0]._id, function(err, record) {
        record.entries = _.merge(record.entries, newEntries);
        console.log(record);
        record.save(function(err) {
          return record;
        })
      });
    });

  });
}

// Takes PDF Data and transfers it into the DB
exports.create = function(req, res) {
  var schoolId = req.body.schoolId;
  fs.readFile(req.file.path, function(err, buffer) {
    if (err) return console.log(err);
    pdf2table.parse(buffer, function(err, rows) {
      if (err) return console.log(err);
      var results = _.chunk(rows.reverse(), 6).reduce(function(p, block) {
        return p.concat(parseStudents(block));
      }, []);
      filterNewStudents(results, schoolId);
    });
  });
  res.status(204).end()
};

function handleError(res, err) {
  return res.send(500, err);
}