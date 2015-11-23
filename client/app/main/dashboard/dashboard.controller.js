'use strict';

var app = angular.module('app');

app.controller('DashboardCtrl', function($scope, Data) {

  $scope.studentGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true
  };

  $scope.studentGridOptions.columnDefs = [{
    name: 'entries.student.studentId',
    displayName: 'Student Id',
    minWidth: 150
  }, {
    name: 'entries.student.firstName',
    displayName: 'First Name',
    minWidth: 150
  }, {
    name: 'entries.student.lastName',
    displayName: 'Last Name',
    minWidth: 150
  }, {
    name: 'entries.absences',
    displayName: 'Absences',
    minWidth: 150
  }, {
    name: 'entries.tardies',
    displayName: 'Tardies',
    minWidth: 150
  }, {
    name: 'entries.present',
    displayName: 'Present',
    minWidth: 150
  }, {
    name: 'entries.enrolled',
    displayName: 'Enrolled',
    minWidth: 150
  }, {
    name: 'school.name',
    displayName: 'School Name',
    minWidth: 150
  }];

  $scope.studentGridOptions.onRegisterApi = function(gridApi) {
    $scope.studentGridApi = gridApi;
    $scope.studentGridOptions.data = Data.entries();
  };

  $scope.letters = 45;
  $scope.calls = 3;
  $scope.home = 0;
  $scope.court = 4;
  $scope.sst = 20;
});
