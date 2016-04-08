'use strict';

var app = angular.module('app');

function AtRiskReportCtrl($scope, $timeout, GridDefaults) {
  $scope.loading = true;

  $scope.gridOptions = GridDefaults.recordOptions($scope, {filter: 'at-risk'});
  $scope.csvFileNameFn = function() {
    return GridDefaults.datePrefix() + ' At Risk.csv';
  };

  $scope.$watch('showWithdrawn', function(n, o) {
    if (n !== o) {
      $scope.gridApi.grid.refresh();
      $timeout($scope.gridApi.treeBase.expandAllRows);
    }
  });
}

app.controller('AtRiskReportCtrl', AtRiskReportCtrl);
