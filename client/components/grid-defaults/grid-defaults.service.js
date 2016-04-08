'use strict';

function GridDefaults($timeout, uiGridGroupingConstants, Student,
  AbsenceRecord) {
  function options() {
    return {
      rowHeight: 27,
      enableSorting: true,
      enableGridMenu: true,
      enableFiltering: true,
      treeRowHeaderAlwaysVisible: false,
      exporterMenuPdf: false
    };
  }

  var colDefs = {
    school: function(name) {
      return {
        name: name,
        displayName: 'School Name',
        minWidth: 150,
        grouping: {groupPriority: 0},
        sort: {priority: 0, direction: 'asc'}
      };
    },
    studentId: function(studentPath) {
      return {
        name: studentPath + '.studentId',
        displayName: 'Student Id',
        minWidth: 150,
        cellTemplate: '<div class="ui-grid-cell-contents">' +
                      '<a ui-sref="student.outreaches({studentId: row.entity.' +
                      studentPath + '._id})">{{row.entity.' + studentPath +
                      '.studentId}}</a></div>'
      };
    },
    firstName: function(name) {
      return {
        name: name,
        displayName: 'First Name',
        minWidth: 150
      };
    },
    lastName: function(name) {
      return {
        name: name,
        displayName: 'Last Name',
        minWidth: 150
      };
    },
    withdrawn: function(scope, name) {
      return {
        name: name,
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
        visible: false
      };
    }
  };

  /**
   * NOTE: This grid options object is very tightly coupled to the scope of the
   * controller. It attempts to set properties of the scope object (loading,
   * and gridApi) in the onRegisterApi function.
   */
  function recordOptions(scope, filter) {
    var gridOptions = _.merge(options(), {
      columnDefs: [
        colDefs.school('school.name'),
        colDefs.studentId('entries.student'),
        colDefs.firstName('entries.student.firstName'),
        colDefs.lastName('entries.student.lastName'),
        {
          name: 'entries.absences',
          displayName: 'Absences',
          type: 'number',
          minWidth: 100,
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM
        },
        {
          name: 'entries.absencesDelta',
          displayName: 'Δ',
          type: 'number',
          width: 50
        },
        {
          name: 'entries.tardies',
          displayName: 'Tardies',
          type: 'number',
          minWidth: 100,
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM
        },
        {
          name: 'entries.tardiesDelta',
          displayName: 'Δ',
          type: 'number',
          width: 50
        },
        {
          name: 'entries.present',
          displayName: 'Present',
          type: 'number',
          minWidth: 100
        },
        {
          name: 'entries.enrolled',
          displayName: 'Enrolled',
          type: 'number',
          minWidth: 100
        },
        {
          name: 'entries.student.iep',
          displayName: 'IEP',
          enableCellEdit: true,
          type: 'boolean',
          width: 100,
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM
        },
        {
          name: 'entries.student.cfa',
          displayName: 'CFA',
          enableCellEdit: true,
          type: 'boolean',
          width: 100,
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM
        },
        colDefs.withdrawn(scope, 'entries.student.withdrawn'),
        {
          name: 'updated',
          field: 'updated()',
          displayName: 'Updated',
          type: 'date',
          cellFilter: 'date:\'MM/dd/yy\'',
          width: 125
        }]
    });
    gridOptions.onRegisterApi = function(gridApi) {
      scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit(scope, function(row, colDef, n, o) {
        if (n !== o) {
          switch (colDef.name) {
            case 'entries.student.iep':
              Student.updateIEP(row.entries.student);
              break;
            case 'entries.student.cfa':
              Student.updateCFA(row.entries.student);
              break;
            case 'entries.student.withdrawn':
              Student.updateWithdrawn(row.entries.student);
              break;
          }
        }
      });
      gridOptions.data = AbsenceRecord.listCurrent(filter || {});
      gridOptions.data.$promise.then(function(data) {
        _.forEach(data, function(row) {
          row.updated = function() {
            return row.entries.date || row.date;
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

  return {
    options: options,
    colDefs: colDefs,
    recordOptions: recordOptions
  };
}

angular.module('app').factory('GridDefaults', GridDefaults);
