'use strict';

var app = angular.module('app');

function DashboardCtrl($scope, $timeout, Auth, AbsenceRecord, Student,
  uiGridGroupingConstants) {
  $scope.menuItems = [];
  $scope.filter = {};
  $scope.loading = true;

  $scope.studentGridOptions = {
    rowHeight: 27,
    enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, color: 'grey'},
    exporterPdfHeader: {text: 'Student Data', style: 'headerStyle'},
    exporterPdfOrientation: 'landscape',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
    exporterPdfFooter: function(currentPage, pageCount) {
      return {
        text: currentPage.toString() + ' of ' + pageCount.toString(),
        style: 'footerStyle'
      };
    },
    exporterPdfCustomFormatter: function(docDefinition) {
      docDefinition.styles.headerStyle =
      {fontSize: 22, bold: true, color: '#265E6D'};
      docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
      return docDefinition;
    }
  };

  $scope.studentGridOptions.columnDefs = [{
    name: 'school.name',
    displayName: 'School Name',
    minWidth: 150,
    grouping: {groupPriority: 0},
    sort: {priority: 0, direction: 'asc'},
    cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP">' +
                  '{{COL_FIELD CUSTOM_FILTERS}} ' +
                  '<span ng-if="row.treeLevel > -1">' +
                  '<i class="fa fa-child"></i>' +
                  '</span>' +
                  '</div>'
  }, {
    name: 'entries.student.studentId',
    displayName: 'Student Id',
    minWidth: 150,
    cellTemplate: '<div class="ui-grid-cell-contents">' +
                  '<a ui-sref="student.outreaches({studentId: ' +
                  'row.entity.entries.student._id})">' +
                  '{{row.entity.entries.student.studentId}}</a>' +
                  '</div>'
  }, {
    name: 'entries.student.firstName',
    displayName: 'First Name',
    minWidth: 150
  }, {
    name: 'entries.student.lastName',
    displayName: 'Last Name',
    minWidth: 150
  }, {
    name: 'entries.absences',
    displayName: 'Absences',
    type: 'number',
    minWidth: 100,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.absencesDelta',
    displayName: 'Δ',
    type: 'number',
    width: 50
  }, {
    name: 'entries.tardies',
    displayName: 'Tardies',
    type: 'number',
    minWidth: 100,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.tardiesDelta',
    displayName: 'Δ',
    type: 'number',
    width: 50
  }, {
    name: 'entries.present',
    displayName: 'Present',
    type: 'number',
    minWidth: 100
  }, {
    name: 'entries.enrolled',
    displayName: 'Enrolled',
    type: 'number',
    minWidth: 100
  }, {
    name: 'entries.student.iep',
    displayName: 'IEP',
    enableCellEdit: true,
    type: 'boolean',
    width: 100,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.student.cfa',
    displayName: 'CFA',
    enableCellEdit: true,
    type: 'boolean',
    width: 100,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.student.withdrawn',
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
  }, {
    name: 'updated',
    field: 'updated()',
    displayName: 'Updated',
    type: 'date',
    cellFilter: 'date:\'MM/dd/yy\'',
    width: 125
  }];

  if (Auth.getCurrentUser().role === 'teacher') {
    $scope.assignment = Auth.getCurrentUser().assignment;
  }

  $scope.studentGridOptions.onRegisterApi = function(gridApi) {
    $scope.studentGridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, n, o) {
      if (n !== o) {
        switch (colDef.name) {
          case 'entries.student.iep':
            $scope.updateIEP(rowEntity.entries.student);
            break;
          case 'entries.student.cfa':
            $scope.updateCFA(rowEntity.entries.student);
            break;
          case 'entries.student.withdrawn':
            $scope.updateWithdrawn(rowEntity.entries.student);
            break;
        }
      }
    });
    $scope.studentGridOptions.data = AbsenceRecord.listCurrent();
    $scope.studentGridOptions.data.$promise.then(function(data) {
      _.forEach(data, function(row) {
        row.updated = function() {
          return row.entries.date || row.date;
        };
      });
      // NOTE: Hack to default to expanded rows on initial load.
      // https://github.com/angular-ui/ui-grid/issues/3841
      $timeout($scope.studentGridApi.treeBase.expandAllRows);
      $scope.loading = false;
    });
  };

  $scope.updateIEP = Student.updateIEP;
  $scope.updateCFA = Student.updateCFA;
  $scope.updateWithdrawn = Student.updateWithdrawn;

  Student.outreachCounts().then(function(counts) {
    $scope.counts = counts;
  });

  $scope.setFilter = function(type, tier) {
    if ($scope.filter.type !== type || $scope.filter.tier !== tier) {
      var filter = {};
      if (type) {
        filter.filter = 'query';
        filter.type = type;
        if (tier) {
          filter.tier = tier;
        }
      }
      $scope.loading = true;
      $scope.filter = filter;
      $scope.studentGridOptions.data = AbsenceRecord.listCurrent($scope.filter);
      $scope.studentGridOptions.data.$promise.then(function(data) {
        _.forEach(data, function(row) {
          row.updated = function() {
            return row.entries.date || row.date;
          };
        });
        $scope.loading = false;
        $timeout($scope.studentGridApi.treeBase.expandAllRows);
      });
      $scope.menuItems.length = 1;
      if (_.includes(['Phone Call', 'Letter Sent', 'Home Visit'], type)) {
        [].push.apply($scope.menuItems, [{
          separator: true,
          text: type + ' #1',
          action: function() {$scope.setFilter(type, 1);}
        }, {
          text: type + ' #2',
          action: function() {$scope.setFilter(type, 2);}
        }, {
          text: type + ' #3',
          action: function() {$scope.setFilter(type, 3);}
        }, {
          separator: true,
          text: type + ' (All)',
          action: function() {$scope.setFilter(type);}
        }]);
      }
    }
  };

  $scope.tableTitle = function() {
    return ($scope.assignment ? $scope.assignment.name : 'Students') +
           ($scope.filter.type ? ' (' + $scope.filter.type +
           ($scope.filter.tier ? ' #' + $scope.filter.tier : '') + ')' : '');
  };

  $scope.menuItems = [{
    text: ' Withdrawn Students',
    action: function() {
      $scope.showWithdrawn = !$scope.showWithdrawn;
    },
    iconFn: function() {
      return $scope.showWithdrawn ?
             'fa-check-square-o text-success' : 'fa-square-o';
    }
  }];

  $scope.$watch('showWithdrawn', function(n, o) {
    if (n !== o) {
      Student.outreachCounts().then(function(counts) {
        $scope.counts = counts;
      });
      $scope.studentGridApi.grid.refresh();
      $timeout($scope.studentGridApi.treeBase.expandAllRows);
    }
  });
}

app.controller('DashboardCtrl', DashboardCtrl);
