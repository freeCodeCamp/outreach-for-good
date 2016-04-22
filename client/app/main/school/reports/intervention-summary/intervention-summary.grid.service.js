'use strict';

function InterventionSummaryGrid($timeout, GridDefaults, Student) {
  var columnDefs = [
    GridDefaults.colDefs.school(),
    GridDefaults.colDefs.studentId(),
    GridDefaults.colDefs.firstName(),
    GridDefaults.colDefs.lastName(),
    {
      name: 'type',
      displayName: 'Type',
      headerTooltip: 'Type',
      minWidth: 54 * 3,
      grouping: {groupPriority: 1},
      sort: {priority: 0, direction: 'asc'}
    }
  ];

  function csvFileNameFn() {
    return GridDefaults.datePrefix() + ' Intervention Summary.csv';
  }

  this.options = function(scope) {
    var gridOptions = _.merge(GridDefaults.options(), {
      rowTemplate: 'components/grid-defaults/grid-defaults.record.row.html',
      columnDefs: _.concat(columnDefs, [GridDefaults.colDefs.withdrawn(scope)]),
      csvFileNameFn: csvFileNameFn
    });
    gridOptions.onRegisterApi = function(gridApi) {
      gridApi.edit.on.afterCellEdit(scope, GridDefaults.afterCellEditFn(scope));
      Student.interventionSummary().$promise.then(function(data) {
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

angular.module('app')
  .service('InterventionSummaryGrid', InterventionSummaryGrid);
