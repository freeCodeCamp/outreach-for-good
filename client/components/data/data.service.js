'use strict';

var app = angular.module('app');

app.service('Data', function() {
  var _schools = [];
  var _students = [];
  var _entries = [];

  this.schools = function() {
    return _schools;
  };
  this.setSchools = function(schools) {
    _schools.length = 0;
    [].push.apply(_schools, schools);
  };

  this.students = function() {
    return _students;
  };
  this.setStudents = function(students) {
    _students.length = 0;
    [].push.apply(_students, students);
  };

  this.entries = function() {
    return _entries;
  };
  this.setEntries = function(entries) {
    _entries.length = 0;
    [].push.apply(_entries, entries);
  };
});
