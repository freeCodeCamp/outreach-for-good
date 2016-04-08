'use strict';

var app = angular.module('app');

function ChronicallyAbsentReportCtrl($scope, $timeout, GridDefaults) {
  $scope.loading = true;

  $scope.gridOptions = GridDefaults.recordOptions($scope, {filter: 'chronic'});
  $scope.csvFileNameFn = function() {
    return GridDefaults.datePrefix() + ' Chronically Absent.csv';
  };

  $scope.$watch('showWithdrawn', function(n, o) {
    if (n !== o) {
      $scope.gridApi.grid.refresh();
      $timeout($scope.gridApi.treeBase.expandAllRows);
    }
  });
}

app.controller('ChronicallyAbsentReportCtrl', ChronicallyAbsentReportCtrl);
