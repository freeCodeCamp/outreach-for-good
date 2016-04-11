'use strict';

var app = angular.module('app');

function ChronicallyAbsentReportCtrl($scope, $timeout, GridDefaults,
  SchoolReportsMenu) {
  $scope.loading = true;
  $scope.gridOptions = GridDefaults.recordOptions($scope, {filter: 'chronic'});
  $scope.csvFileNameFn = function() {
    return GridDefaults.datePrefix() + ' Chronically Absent.csv';
  };
  SchoolReportsMenu.defaultItems($scope);
}

app.controller('ChronicallyAbsentReportCtrl', ChronicallyAbsentReportCtrl);
