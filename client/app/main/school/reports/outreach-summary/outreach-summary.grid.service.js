'use strict';

function OutreachSummaryGrid($timeout, GridDefaults, Student) {
  var totalsDefault = {
    Phone: {count: 0, resolved: 0, outstanding: 0},
    Letter: {count: 0, resolved: 0, outstanding: 0},
    Home: {count: 0, resolved: 0, outstanding: 0},
    SST: {count: 0, resolved: 0, outstanding: 0},
    Court: {count: 0, resolved: 0, outstanding: 0}
  };

  var columnDefs = [
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
    GridDefaults.colDefs.cfa()
  ];

  function csvFileNameFn() {
    return GridDefaults.datePrefix() + ' Outreach Summary.csv';
  }

  function reshape(data) {
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
    return data;
  }

  this.options = function(scope) {
    var gridOptions = _.merge(GridDefaults.options(), {
      columnDefs: _.concat(columnDefs, [GridDefaults.colDefs.withdrawn(scope)]),
      csvFileNameFn: csvFileNameFn
    });
    gridOptions.onRegisterApi = function(gridApi) {
      gridApi.edit.on.afterCellEdit(scope, GridDefaults.afterCellEditFn(scope));
      Student.outreachSummary().$promise.then(reshape).then(function(data) {
        gridOptions.data = data;
        // NOTE: Hack to default to expanded rows on initial load.
        // https://github.com/angular-ui/ui-grid/issues/3841
        $timeout(gridApi.treeBase.expandAllRows);
        scope.loading = false;
      });
      scope.gridApi = gridApi;
    };
    return gridOptions;
  };
}

angular.module('app').service('OutreachSummaryGrid', OutreachSummaryGrid);
