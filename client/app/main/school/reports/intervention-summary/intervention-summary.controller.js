'use strict';

var app = angular.module('app');

function InterventionSummaryCtrl($scope, $timeout, GridDefaults,
  SchoolReportsMenu, Student) {
  $scope.loading = true;

  $scope.gridOptions = GridDefaults.options();
  $scope.gridOptions.columnDefs = [
    GridDefaults.colDefs.school(),
    GridDefaults.colDefs.studentId(),
    GridDefaults.colDefs.firstName(),
    GridDefaults.colDefs.lastName(),
    {
      name: 'type',
      displayName: 'Type',
      minWidth: 150,
      grouping: {groupPriority: 1},
      sort: {priority: 0, direction: 'asc'}
    },
    GridDefaults.colDefs.withdrawn($scope)
  ];
  $scope.gridOptions.onRegisterApi = function(gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function(row, colDef, n, o) {
      if (n !== o) {
        switch (colDef.name) {
          case 'student.withdrawn':
            Student.updateWithdrawn(row.student);
            break;
        }
      }
    });
    $scope.gridOptions.data = Student.interventionSummary();
    $scope.gridOptions.data.$promise.then(function() {
      // NOTE: Hack to default to expanded rows on initial load.
      // https://github.com/angular-ui/ui-grid/issues/3841
      $timeout(gridApi.treeBase.expandAllRows);
      $scope.loading = false;
    });
  };
  $scope.gridOptions.csvFileNameFn = function() {
    return GridDefaults.datePrefix() + ' Intervention Summary.csv';
  };
  SchoolReportsMenu.defaultItems($scope);
}

app.controller('InterventionSummaryCtrl', InterventionSummaryCtrl);