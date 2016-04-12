'use strict';

function GridDefaults($filter, $timeout, Student, AbsenceRecord,
  uiGridGroupingConstants, uiGridExporterService) {
  var colDefs = {};
  colDefs.school = function(name) {
    return {
      name: name || 'school.name',
      displayName: 'School Name',
      minWidth: 150,
      grouping: {groupPriority: 0},
      sort: {priority: 0, direction: 'asc'}
    };
  };
  // This specific colDef requires student to be populated at the root of the
  // row entity. No name parameter.
  colDefs.studentId = function() {
    return {
      name: 'student.studentId',
      displayName: 'Student Id',
      minWidth: 150,
      cellTemplate: 'components/grid-defaults/grid-defaults.student-id.html'
    };
  };
  colDefs.firstName = function(name) {
    return {
      name: name || 'student.firstName',
      displayName: 'First Name',
      minWidth: 150
    };
  };
  colDefs.lastName = function(name) {
    return {
      name: name || 'student.lastName',
      displayName: 'Last Name',
      minWidth: 150
    };
  };
  colDefs.iep = function(name) {
    return {
      name: name || 'student.iep',
      displayName: 'IEP',
      enableCellEdit: true,
      type: 'boolean',
      width: 100,
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    };
  };
  colDefs.cfa = function(name) {
    return {
      name: name || 'student.cfa',
      displayName: 'CFA',
      enableCellEdit: true,
      type: 'boolean',
      width: 100,
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM
    };
  };
  colDefs.withdrawn = function(scope, name) {
    return {
      name: name || 'student.withdrawn',
      displayName: 'Withdrawn',
      enableCellEdit: true,
      type: 'boolean',
      width: 100,
      filter: {
        noTerm: true,
        condition: function(searchTerm, cellValue) {
          if (scope.showWithdrawn) {
            return true;
          }
          return cellValue === false;
        }
      },
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: false
    };
  };
  colDefs.updated = function() {
    return {
      name: 'updated',
      field: 'updated()',
      displayName: 'Updated',
      type: 'date',
      cellFilter: 'date:\'MM/dd/yy\'',
      width: 125
    };
  };
  colDefs.outreach = function(name, type, visible) {
    var firstWord = name.split(' ')[0];
    return {
      name: firstWord + '.' + type,
      displayName: type === 'count' ? firstWord : _.capitalize(type),
      minWidth: 80,
      type: 'number',
      headerTooltip: name + ' ' + _.capitalize(type),
      treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
      visible: !!visible
    };
  };

  function options() {
    return {
      rowHeight: 27,
      enableSorting: true,
      enableGridMenu: true,
      enableFiltering: true,
      enableCellEdit: false,
      treeRowHeaderAlwaysVisible: false,
      exporterMenuPdf: false,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0
    };
  }

  function afterCellEditFn(scope) {
    return function(row, colDef, n, o) {
      if (n !== o) {
        switch (colDef.name) {
          case 'student.iep':
            Student.updateIEP(row.student);
            break;
          case 'student.cfa':
            Student.updateCFA(row.student);
            break;
          case 'student.withdrawn':
            Student.updateWithdrawn(row.student);
            scope.$broadcast('withdrawn-updated');
            break;
        }
      }
    };
  }

  /**
   * NOTE: This grid options object is very tightly coupled to the scope of the
   * controller. It attempts to set properties of the scope object (loading,
   * and gridApi) in the onRegisterApi function.
   */
  function recordOptions(scope, filter) {
    var gridOptions = _.merge(options(), {
      exporterFieldCallback: function(grid, row, col, value) {
        switch (col.name) {
          case 'updated':
            value = $filter('date')(value, 'MM/dd/yy');
            break;
        }
        return value;
      },
      csvFileNameFn: scope.csvFileNameFn,
      rowTemplate: 'components/grid-defaults/grid-defaults.record.row.html',
      columnDefs: [
        colDefs.school(),
        colDefs.studentId(),
        colDefs.firstName(),
        colDefs.lastName(),
        {
          name: 'entry.absences',
          displayName: 'Absences',
          type: 'number',
          minWidth: 100,
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM
        },
        {
          name: 'entry.absencesDelta',
          displayName: 'Δ',
          type: 'number',
          width: 50
        },
        {
          name: 'entry.tardies',
          displayName: 'Tardies',
          type: 'number',
          minWidth: 100,
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM
        },
        {
          name: 'entry.tardiesDelta',
          displayName: 'Δ',
          type: 'number',
          width: 50
        },
        {
          name: 'entry.present',
          displayName: 'Present',
          type: 'number',
          minWidth: 100
        },
        {
          name: 'entry.enrolled',
          displayName: 'Enrolled',
          type: 'number',
          minWidth: 100
        },
        colDefs.iep(),
        colDefs.cfa(),
        colDefs.withdrawn(scope),
        colDefs.updated()]
    });
    gridOptions.onRegisterApi = function(gridApi) {
      scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit(scope, afterCellEditFn(scope));
      gridOptions.data = AbsenceRecord.listCurrent(filter || {});
      gridOptions.data.$promise.then(function(data) {
        _.forEach(data, function(row) {
          row.updated = function() {
            return row.entry.date || row.date;
          };
        });
        // NOTE: Hack to default to expanded rows on initial load.
        // https://github.com/angular-ui/ui-grid/issues/3841
        $timeout(gridApi.treeBase.expandAllRows);
        scope.loading = false;
      });
    };
    return gridOptions;
  }

  function datePrefix() {
    return $filter('date')(new Date(), 'yyyy-MM-dd');
  }

  /**
   * Override default csvExport function to look for a csvFileNameFn in
   * the gridOptions. This allows for dynamic naming of the files for
   * timestamping.
   */
  uiGridExporterService.csvExport = function(grid, rowTypes, colTypes) {
    var fileName = grid.options.csvFileNameFn ? grid.options.csvFileNameFn() :
                   grid.options.exporterCsvFilename;
    var self = this;
    this.loadAllDataIfNeeded(grid, rowTypes, colTypes).then(function() {
      var exportColumnHeaders = grid.options.showHeader ?
                                self.getColumnHeaders(grid, colTypes) : [];
      var exportData = self.getData(grid, rowTypes, colTypes);
      var csvContent = self.formatAsCsv(exportColumnHeaders, exportData,
        grid.options.exporterCsvColumnSeparator);
      self.downloadFile (fileName, csvContent,
        grid.options.exporterCsvColumnSeparator,
        grid.options.exporterOlderExcelCompatibility);
    });
  };

  return {
    options: options,
    colDefs: colDefs,
    afterCellEditFn: afterCellEditFn,
    recordOptions: recordOptions,
    datePrefix: datePrefix
  };
}

angular.module('app').factory('GridDefaults', GridDefaults);
