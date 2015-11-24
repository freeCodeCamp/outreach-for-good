'use strict';

var app = angular.module('app');

function MainCtrl($scope, AbsenceRecord, Auth, Data, School, Sidebar, Student) {
  $scope.sidebar = Sidebar;
  var user = Auth.getCurrentUser();
  switch (user.role) {
    case 'teacher':
      if (user.assignment) {
        School.students({id: user.assignment._id}).$promise
          .then(function(students) {
            Data.setStudents(students);
          });
        AbsenceRecord.school({selector: user.assignment._id}).$promise
          .then(function(entries) {
            Data.setEntries(entries);
          });
      }
      break;
    case 'manager':
    case 'admin':
    case 'super':
      School.list().$promise.then(function(schools) {
        Data.setSchools(schools);
      });
      Student.list().$promise.then(function(students) {
        Data.setStudents(students);
      });
      AbsenceRecord.list().$promise.then(function(entries) {
        Data.setEntries(entries);
      });
      break;
  }
}

app.controller('MainCtrl', MainCtrl);
