'use strict';

var app = angular.module('app');

app.controller('DashboardCtrl', function($scope, Data) {

  $scope.studentGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true
  };

  $scope.studentGridOptions.columnDefs = [{
    name: 'studentId',
    displayName: 'Student Id',
    minWidth: 150
  }, {
    name: 'firstName',
    displayName: 'First Name',
    minWidth: 150
  }, {
    name: 'lastName',
    displayName: 'Last Name',
    minWidth: 150
  }, {
    name: 'currentSchool.name',
    displayName: 'School Name',
    minWidth: 150
  }];

  $scope.studentGridOptions.onRegisterApi = function(gridApi) {
    $scope.studentGridApi = gridApi;
    $scope.studentGridOptions.data = Data.students();
  };

  $scope.letters = 45;
  $scope.calls = 3;
  $scope.home = 0;
  $scope.court = 4;
  $scope.sst = 20;
});
