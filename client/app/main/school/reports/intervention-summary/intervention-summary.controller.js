'use strict';

var app = angular.module('app');

function InterventionSummaryCtrl($scope, InterventionSummaryGrid,
  SchoolReportsMenu) {
  $scope.loading = true;
  $scope.gridOptions = InterventionSummaryGrid.options($scope);
  SchoolReportsMenu.defaultItems($scope);
}

app.controller('InterventionSummaryCtrl', InterventionSummaryCtrl);
