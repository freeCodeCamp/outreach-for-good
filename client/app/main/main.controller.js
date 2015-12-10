'use strict';

var app = angular.module('app');

function MainCtrl($scope, AbsenceRecord, Auth, Data, School, Sidebar) {
  $scope.sidebar = Sidebar;
  var user = Auth.getCurrentUser();
  switch (user.role) {
    case 'teacher':
      if (user.assignment) {
        School.get({id: user.assignment._id}).$promise
          .then(function(school) {
            Data.setSchools([school]);
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
      AbsenceRecord.list().$promise.then(function(entries) {
        Data.setEntries(entries);
      });
      break;
  }
}

app.controller('MainCtrl', MainCtrl);
