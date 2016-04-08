'use strict';

var app = angular.module('app');

function OutreachSummaryCtrl($scope, $timeout, GridDefaults,
  uiGridGroupingConstants, Student) {
  $scope.loading = true;

  $scope.gridOptions = GridDefaults.options();
  $scope.gridOptions.columnDefs = [
    GridDefaults.colDefs.school(),
    GridDefaults.colDefs.studentId('student'),
    GridDefaults.colDefs.firstName(),
    GridDefaults.colDefs.lastName(),
    {
      name: 'totals.all',
      displayName: 'Total',
      minWidth: 80,
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'totals["Phone Call"] || 0',
      displayName: 'Calls',
      minWidth: 100,
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'totals["Letter Sent"] || 0',
      displayName: 'Letters',
      minWidth: 100,
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'totals["Home Visit"] || 0',
      displayName: 'Visits',
      minWidth: 100,
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'totals["SST Referral"] || 0',
      displayName: 'SST',
      minWidth: 100,
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'totals["Court Referral"] || 0',
      displayName: 'Court',
      minWidth: 100,
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    },
    GridDefaults.colDefs.withdrawn($scope)
  ];
  $scope.gridOptions.onRegisterApi = function(gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, n, o) {
      if (n !== o) {
        switch (colDef.name) {
          case 'student.withdrawn':
            Student.updateWithdrawn(rowEntity.student);
            break;
        }
      }
    });
    $scope.gridOptions.data = Student.outreachSummary();
    $scope.gridOptions.data.$promise.then(function(data) {
      // Convert counts array to object, generate total intervention property
      _.forEach(data, function(row) {
        row.totals = _(row.counts).keyBy('type').mapValues('count').value();
        row.totals.all = _.sumBy(row.counts, 'count');
      });
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

app.controller('OutreachSummaryCtrl', OutreachSummaryCtrl);
