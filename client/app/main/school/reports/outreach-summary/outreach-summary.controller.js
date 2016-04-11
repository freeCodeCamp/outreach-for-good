'use strict';

var app = angular.module('app');

function OutreachSummaryCtrl($scope, $timeout, OutreachSummaryGrid) {
  $scope.loading = true;
  $scope.gridOptions = OutreachSummaryGrid.options($scope);

  $scope.$watch('showWithdrawn', function(n, o) {
    if (n !== o) {
      $scope.gridApi.grid.refresh();
      $timeout($scope.gridApi.treeBase.expandAllRows);
    }
  });
}

app.controller('OutreachSummaryCtrl', OutreachSummaryCtrl);
