'use strict';

var app = angular.module('app');

function InterventionSummaryCtrl($scope, $timeout, GridDefaults, Student) {
  $scope.loading = true;
  $scope.gridOptions = GridDefaults.options();

  $scope.gridOptions.columnDefs = [
    GridDefaults.colDefs.school('student.currentSchool.name'),
    {
      name: 'type',
      displayName: 'Type',
      minWidth: 150,
      grouping: {groupPriority: 1},
      sort: {priority: 0, direction: 'asc'}
    },
    GridDefaults.colDefs.studentId('student'),
    GridDefaults.colDefs.firstName('student.firstName'),
    GridDefaults.colDefs.lastName('student.lastName'),
    GridDefaults.colDefs.withdrawn($scope, 'student.withdrawn')
  ];
  $scope.gridOptions.onRegisterApi = function(gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, n, o) {
      if (n !== o) {
        switch (colDef.name) {
          case 'student.withdrawn':
            Student.updateWithdrawn(rowEntity.entries.student);
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

  $scope.$watch('showWithdrawn', function(n, o) {
    if (n !== o) {
      $scope.gridApi.grid.refresh();
      $timeout($scope.gridApi.treeBase.expandAllRows);
    }
  });
}

app.controller('InterventionSummaryCtrl', InterventionSummaryCtrl);
