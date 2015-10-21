/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var School = require('../api/school/school.model');
var Student = require('../api/student/student.model');
var User = require('../api/user/user.model');

User.remove().exec().then(function() {
  return School.remove().exec();
}).then(function() {
  return Student.remove().exec();
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
