'use strict';

function AtRiskReportCtrl($scope, $timeout, GridDefaults, SchoolReportsMenu) {
  $scope.loading = true;
  $scope.gridOptions = GridDefaults.recordOptions($scope, {filter: 'at-risk'});
  $scope.csvFileNameFn = function() {
    return GridDefaults.datePrefix() + ' At Risk.csv';
  };
  SchoolReportsMenu.defaultItems($scope);
}

angular.module('app').controller('AtRiskReportCtrl', AtRiskReportCtrl);
