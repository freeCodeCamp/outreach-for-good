'use strict';

function OutreachSummaryCtrl($scope, OutreachSummaryGrid, SchoolReportsMenu) {
  $scope.loading = true;
  $scope.gridOptions = OutreachSummaryGrid.options($scope);
  SchoolReportsMenu.outreachSummaryItems($scope);
}

angular.module('app').controller('OutreachSummaryCtrl', OutreachSummaryCtrl);
