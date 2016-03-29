/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var AbsenceRecord = require('../api/absence-record/absence-record.model');
var Outreach = require('../api/outreach/outreach.model');
var Intervention = require('../api/intervention/intervention.model');
var School = require('../api/school/school.model');
var Student = require('../api/student/student.model');
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
  }, logCreateResults('school'));
}).then(function(schoolA, schoolB) {
  // Fake names from http://homepage.net/name_generator/
  return Student.create({
    studentId: 'sid001',
    lastName: 'Graham',
    firstName: 'Brandon',
    currentSchool: schoolA._id
  }, {
    studentId: 'sid002',
    lastName: 'Simpson',
    firstName: 'Dan',
    currentSchool: schoolA._id
  }, {
    studentId: 'sid003',
    lastName: 'Arnold',
    firstName: 'Gavin',
    currentSchool: schoolA._id
  }, {
    studentId: 'sid004',
    lastName: 'Hughes',
    firstName: 'Victor',
    currentSchool: schoolB._id
  }, {
    studentId: 'sid005',
    lastName: 'Thomson',
    firstName: 'Sue',
    currentSchool: schoolB._id
  }, logCreateResults('students'));
}).then(function(studentA, studentB, studentC, studentD, studentE) {
  return AbsenceRecord.create({
    schoolYear: '2015-2016',
    school: studentA.currentSchool,
    date: Date.now(),
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
    }]
  }, {
    schoolYear: '2015-2016',
    school: studentD.currentSchool,
    date: Date.now(),
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
    }]
  }, logCreateResults('AbsenceRecords'));
}).then(function() {
  return Student.find().populate('currentSchool').exec(function(err, students) {
    console.log('\nSchools to Students');
    students.forEach(function(student) {
      console.log(
        student.currentSchool.name, ':', student.firstName, student.lastName);
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
