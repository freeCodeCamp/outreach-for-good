'use strict';

function InterventionSummaryCtrl($scope, InterventionSummaryGrid,
  SchoolReportsMenu) {
  $scope.loading = true;
  $scope.gridOptions = InterventionSummaryGrid.options($scope);
  SchoolReportsMenu.defaultItems($scope);
}

angular.module('app')
  .controller('InterventionSummaryCtrl', InterventionSummaryCtrl);
