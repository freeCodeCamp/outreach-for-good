'use strict';

var app = angular.module('app');

function MainCtrl($scope, Auth, Data, School, Sidebar, Student) {
  $scope.sidebar = Sidebar;
  var user = Auth.getCurrentUser();
  switch (user.role) {
    case 'teacher':
      if (user.assignment) {
        School.students({id: user.assignment})
          .$promise.then(function(students) {
            Data.setStudents(students);
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
      break;
  }
}

app.controller('MainCtrl', MainCtrl);
