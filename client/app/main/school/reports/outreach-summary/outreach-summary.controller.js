'use strict';

var app = angular.module('app');

function OutreachSummaryCtrl($scope, OutreachSummaryGrid, SchoolReportsMenu) {
  $scope.loading = true;
  $scope.gridOptions = OutreachSummaryGrid.options($scope);
  SchoolReportsMenu.outreachSummaryItems($scope);
}

app.controller('OutreachSummaryCtrl', OutreachSummaryCtrl);
