/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var AbsenceRecord = require('../api/absence-record/absence-record.model');
var School = require('../api/school/school.model');
var Student = require('../api/student/student.model');
var Outreach = require('../api/student/outreach/outreach.model');
var Intervention = require('../api/student/intervention/intervention.model');
var StudentNote = require('../api/student/note/note.model');
var User = require('../api/user/user.model');

AbsenceRecord.remove().exec().then(function() {
  return Outreach.remove().exec();
}).then(function() {
  return Intervention.remove().exec();
}).then(function() {
  return School.remove().exec();
}).then(function() {
  return Student.remove().exec();
}).then(function() {
  return StudentNote.remove().exec();
}).then(function() {
  return User.remove().exec();
}).then(function() {
  return User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com'
  }, logCreateResults('users'));
}).then(function() {
  return School.create({
    name: 'School A'
  }, {
    name: 'School B'
  }, {
    name: 'School C'
  }, logCreateResults('school'));
}).then(function(schoolA, schoolB) {
  // Fake names from http://homepage.net/name_generator/
  return Student.create({
    studentId: 'sid001',
    lastName: 'Graham',
    firstName: 'Brandon',
    school: schoolA._id
  }, {
    studentId: 'sid002',
    lastName: 'Simpson',
    firstName: 'Dan',
    school: schoolA._id
  }, {
    studentId: 'sid003',
    lastName: 'Arnold',
    firstName: 'Gavin',
    school: schoolA._id
  }, {
    studentId: 'sid004',
    lastName: 'Hughes',
    firstName: 'Victor',
    school: schoolB._id
  }, {
    studentId: 'sid005',
    lastName: 'Thomson',
    firstName: 'Sue',
    school: schoolB._id
  }, logCreateResults('students'));
}).then(function(studentA, studentB, studentC, studentD, studentE) {
  var twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  return AbsenceRecord.create({
    schoolYear: '2015-2016',
    school: studentA.school,
    date: twoDaysAgo,
    entries: [{
      student: studentA._id,
      absences: 1.0,
      absencesDelta: 1.0,
      tardies: 0.0,
      tardiesDelta: 0.0,
      present: 15.0,
      enrolled: 16.0
    }, {
      student: studentB._id,
      absences: 1.0,
      absencesDelta: 1.0,
      tardies: 0.0,
      tardiesDelta: 0.0,
      present: 14.0,
      enrolled: 15.0
    }, {
      student: studentC._id,
      absences: 1.0,
      absencesDelta: 1.0,
      tardies: 0,
      tardiesDelta: 0.0,
      present: 21.0,
      enrolled: 22.0
    }],
    createdStudents: [studentA._id, studentB._id, studentC._id]
  }, {
    schoolYear: '2015-2016',
    school: studentD.school,
    date: twoDaysAgo,
    entries: [{
      student: studentD._id,
      absences: 0.0,
      absencesDelta: 0.0,
      tardies: 0.0,
      tardiesDelta: 0.0,
      present: 1.0,
      enrolled: 1.0
    }, {
      student: studentE._id,
      absences: 0.0,
      absencesDelta: 0.0,
      tardies: 0.0,
      tardiesDelta: 0.0,
      present: 22.0,
      enrolled: 22.0
    }],
    createdStudents: [studentD._id, studentE._id]
  }, logCreateResults('AbsenceRecords'));
}).then(function() {
  return Student.find().populate('school').exec(function(err, students) {
    console.log('\nSchools to Students');
    students.forEach(function(student) {
      console.log(
        student.school.name, ':', student.firstName, student.lastName);
    });
  });
});

function logCreateResults(model) {
  return function(err) {
    if (err) throw new Error('Error populating ' + model + ': ' + err);
    console.log('\nfinished populating ' + model);
    for (var i = 1; i < arguments.length; i++) {
      console.log(arguments[i]);
    }
  }
}
