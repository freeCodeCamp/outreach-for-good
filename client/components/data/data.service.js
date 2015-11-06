'use strict';

var app = angular.module('app');

app.service('Data', function() {
  var _students = [];

  this.students = function() {
    return _students;
  };
  this.setStudents = function(students) {
    _students.length = 0;
    [].push.apply(_students, students);
  };
});
