'use strict';

var app = angular.module('app');

function OutreachSummaryCtrl($scope, $timeout, GridDefaults, Student) {
  var totalsDefault = {
    Phone: {count: 0, resolved: 0, outstanding: 0},
    Letter: {count: 0, resolved: 0, outstanding: 0},
    Home: {count: 0, resolved: 0, outstanding: 0},
    SST: {count: 0, resolved: 0, outstanding: 0},
    Court: {count: 0, resolved: 0, outstanding: 0}
  };
  $scope.loading = true;

  $scope.gridOptions = GridDefaults.options();
  $scope.gridOptions.columnDefs = [
    GridDefaults.colDefs.school(),
    GridDefaults.colDefs.studentId(),
    GridDefaults.colDefs.firstName(),
    GridDefaults.colDefs.lastName(),
    GridDefaults.colDefs.outreach('Phone Call', 'count', true),
    GridDefaults.colDefs.outreach('Phone Call', 'resolved'),
    GridDefaults.colDefs.outreach('Phone Call', 'outstanding'),
    GridDefaults.colDefs.outreach('Letter Sent', 'count', true),
    GridDefaults.colDefs.outreach('Letter Sent', 'resolved'),
    GridDefaults.colDefs.outreach('Letter Sent', 'outstanding'),
    GridDefaults.colDefs.outreach('Home Visit', 'count', true),
    GridDefaults.colDefs.outreach('Home Visit', 'resolved'),
    GridDefaults.colDefs.outreach('Home Visit', 'outstanding'),
    GridDefaults.colDefs.outreach('SST Referral', 'count', true),
    GridDefaults.colDefs.outreach('SST Referral', 'resolved'),
    GridDefaults.colDefs.outreach('SST Referral', 'outstanding'),
    GridDefaults.colDefs.outreach('Court Referral', 'count', true),
    GridDefaults.colDefs.outreach('Court Referral', 'resolved'),
    GridDefaults.colDefs.outreach('Court Referral', 'outstanding'),
    GridDefaults.colDefs.outreach('Total', 'count', true),
    GridDefaults.colDefs.outreach('Total', 'resolved'),
    GridDefaults.colDefs.outreach('Total', 'outstanding'),
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
        totals.Total = {
          count: _.sumBy(row.counts, 'count'),
          resolved: _.sumBy(row.counts, 'resolved'),
          outstanding: _.sumBy(row.counts, 'outstanding')
        };
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
