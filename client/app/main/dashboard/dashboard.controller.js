'use strict';

var app = angular.module('app');

function DashboardCtrl($scope, Data, Auth, uiGridGroupingConstants) {
  $scope.studentGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false
  };

  $scope.studentGridOptions.columnDefs = [{
    name: 'entries.student.studentId',
    displayName: 'Student Id',
    minWidth: 150,
    cellTemplate: '<div class="ui-grid-cell-contents">' +
                  '<a href="/student/{{row.entity.entries.student._id}}">' +
                  '{{row.entity.entries.student.studentId}}</a>' +
                  '</div>'
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
    minWidth: 150,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.absencesDelta',
    displayName: "Δ",
    minWidth: 50
  }, {
    name: 'entries.tardies',
    displayName: 'Tardies',
    minWidth: 150,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.tardiesDelta',
    displayName: "Δ",
    minWidth: 50
  }, {
    name: 'entries.present',
    displayName: 'Present',
    minWidth: 150
  }, {
    name: 'entries.enrolled',
    displayName: 'Enrolled',
    minWidth: 150
  }];

  if (Auth.getCurrentUser().role !== 'teacher') {
    $scope.studentGridOptions.columnDefs.push({
      name: 'school.name',
      displayName: 'School Name',
      minWidth: 150,
      grouping: {groupPriority: 0},
      sort: {priority: 0, direction: 'asc'}
    });
  } else {
    $scope.assignment = Auth.getCurrentUser().assignment;
  }

  $scope.studentGridOptions.onRegisterApi = function(gridApi) {
    $scope.studentGridApi = gridApi;
    $scope.studentGridOptions.data = Data.entries();
  };

  $scope.letters = 45;
  $scope.calls = 3;
  $scope.home = 0;
  $scope.court = 4;
  $scope.sst = 20;
}

app.controller('DashboardCtrl', DashboardCtrl);
