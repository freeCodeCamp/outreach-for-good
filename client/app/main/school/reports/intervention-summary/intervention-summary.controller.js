'use strict';

var app = angular.module('app');

function InterventionSummaryCtrl($scope, $timeout, uiGridGroupingConstants,
  Student) {
  $scope.loading = true;
  $scope.gridOptions = {
    rowHeight: 27,
    enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    exporterMenuPdf: false
  };

  $scope.gridOptions.columnDefs = [{
    name: 'student.currentSchool.name',
    displayName: 'School Name',
    minWidth: 150,
    grouping: {groupPriority: 0},
    sort: {priority: 0, direction: 'asc'}
  }, {
    name: 'type',
    displayName: 'Type',
    minWidth: 150,
    grouping: {groupPriority: 1},
    sort: {priority: 0, direction: 'asc'}
  }, {
    name: 'student.studentId',
    displayName: 'Student Id',
    minWidth: 150,
    cellTemplate: '<div class="ui-grid-cell-contents">' +
                  '<a ui-sref="student.outreaches({studentId: ' +
                  'row.entity.student._id})">' +
                  '{{row.entity.student.studentId}}</a>' +
                  '</div>'
  }, {
    name: 'student.firstName',
    displayName: 'First Name',
    minWidth: 150
  }, {
    name: 'student.lastName',
    displayName: 'Last Name',
    minWidth: 150
  }, {
    name: 'student.withdrawn',
    displayName: 'Withdrawn',
    enableCellEdit: true,
    type: 'boolean',
    width: 100,
    filter: {
      noTerm: true,
      condition: function(searchTerm, cellValue) {
        if ($scope.showWithdrawn) {
          return true;
        }
        return cellValue === false;
      }
    },
    visible: false
  }];

  $scope.gridOptions.onRegisterApi = function(gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, n, o) {
      if (n !== o) {
        switch (colDef.name) {
          case 'student.withdrawn':
            $scope.updateWithdrawn(rowEntity.entries.student);
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
