'use strict';

var app = angular.module('app');

function OutreachSummaryCtrl($scope, $timeout, GridDefaults,
  uiGridGroupingConstants, Student) {
  $scope.loading = true;

  $scope.gridOptions = GridDefaults.options();
  $scope.gridOptions.columnDefs = [
    GridDefaults.colDefs.school(),
    GridDefaults.colDefs.studentId(),
    GridDefaults.colDefs.firstName(),
    GridDefaults.colDefs.lastName(),
    {
      name: 'Phone.count',
      displayName: 'Phone',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Phone Calls',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'Phone.resolved',
      displayName: 'Resolved',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Phone Resolved',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'Phone.outstanding',
      displayName: 'Outstanding',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Phone Outstanding',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'Letter.count',
      displayName: 'Letter',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Letters Sent',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'Letter.resolved',
      displayName: 'Resolved',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Letter Resolved',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'Letter.outstanding',
      displayName: 'Outstanding',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Letter Outstanding',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'Home.count',
      displayName: 'Home',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Home Visits',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'Home.resolved',
      displayName: 'Resolved',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Home Resolved',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'Home.outstanding',
      displayName: 'Outstanding',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Home Outstanding',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'SST.count',
      displayName: 'SST',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'SST Referrals',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'SST.resolved',
      displayName: 'Resolved',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'SST Resolved',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'SST.outstanding',
      displayName: 'Outstanding',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'SST Outstanding',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'Court.count',
      displayName: 'Court',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Court Referrals',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'Court.resolved',
      displayName: 'Resolved',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Court Resolved',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'Court.outstanding',
      displayName: 'Outstanding',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Court Outstanding',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'count',
      displayName: 'Total',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Total Outreaches',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    }, {
      name: 'resolved',
      displayName: 'Resolved',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Resolved Outreaches',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    }, {
      name: 'outstanding',
      displayName: 'Outstanding',
      minWidth: 80,
      type: 'number',
      headerTooltip: 'Outstanding Outreaches',
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    },
    GridDefaults.colDefs.cfa(),
    GridDefaults.colDefs.withdrawn($scope)
  ];
  $scope.gridOptions.onRegisterApi = function(gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function(row, colDef, n, o) {
      if (n !== o) {
        switch (colDef.name) {
          case 'student.cfa':
            Student.updateCFA(row.student);
            break;
          case 'student.withdrawn':
            Student.updateWithdrawn(row.student);
            break;
        }
      }
    });
    var totalsDefault = {
      Phone: {count: 0, resolved: 0, outstanding: 0},
      Letter: {count: 0, resolved: 0, outstanding: 0},
      Home: {count: 0, resolved: 0, outstanding: 0},
      SST: {count: 0, resolved: 0, outstanding: 0},
      Court: {count: 0, resolved: 0, outstanding: 0}
    };
    $scope.gridOptions.data = Student.outreachSummary();
    $scope.gridOptions.data.$promise.then(function(data) {
      // Convert counts array to object, generate total intervention property.
      _.forEach(data, function(row) {
        var totals = _(row.counts)
          .keyBy('type')
          .mapKeys(function(value, key) {
            return key.split(' ')[0];
          })
          .defaults(totalsDefault)
          .value();
        totals.count = _.sumBy(row.counts, 'count');
        totals.resolved = _.sumBy(row.counts, 'resolved');
        totals.outstanding = _.sumBy(row.counts, 'outstanding');
        _.assign(row, totals);
      });
      // NOTE: Hack to default to expanded rows on initial load.
      // https://github.com/angular-ui/ui-grid/issues/3841
      $timeout(gridApi.treeBase.expandAllRows);
      $scope.loading = false;
    });
  };
  $scope.gridOptions.csvFileNameFn = function() {
    return GridDefaults.datePrefix() + ' Outreach Summary.csv';
  };

  $scope.$watch('showWithdrawn', function(n, o) {
    if (n !== o) {
      $scope.gridApi.grid.refresh();
      $timeout($scope.gridApi.treeBase.expandAllRows);
    }
  });
}

app.controller('OutreachSummaryCtrl', OutreachSummaryCtrl);
