'use strict';

var app = angular.module('app');

function DashboardCtrl($scope, $timeout, Auth, AbsenceRecord, Outreach,
  Student, uiGridGroupingConstants, toastr) {
  $scope.menuItems = [];
  $scope.filter = {};

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
    name: 'entries.student.studentId',
    displayName: 'Student Id',
    minWidth: 150,
    cellTemplate: '<div class="ui-grid-cell-contents">' +
                  '<a href="/student/{{row.entity.entries.student._id}}">' +
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
    name: 'date',
    displayName: 'Uploaded',
    cellFilter: 'date:\'MM/dd/yy\'',
    width: 125
  }];

  $scope.updateIEP = function(student) {
    if (student._id) {
      var oldVal = !student.iep;
      var promise =
        Student.updateIEP({id: student._id}, {iep: student.iep}).$promise;
      promise.then(function() {
        toastr.success(
          'IEP updated to ' + student.iep,
          student.firstName + ' ' + student.lastName);
      }, function(err) {
        student.iep = oldVal;
        toastr.error(err);
      });
    }
  };

  $scope.updateCFA = function(student) {
    if (student._id) {
      var oldVal = !student.cfa;
      var promise =
        Student.updateCFA({id: student._id}, {cfa: student.cfa}).$promise;
      promise.then(function() {
        toastr.success(
          'CFA updated to ' + student.cfa,
          student.firstName + ' ' + student.lastName);
      }, function(err) {
        student.cfa = oldVal;
        toastr.error(err);
      });
    }
  };

  if (Auth.getCurrentUser().role !== 'teacher') {
    $scope.studentGridOptions.columnDefs.push({
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
    });
  } else {
    $scope.assignment = Auth.getCurrentUser().assignment;
  }

  $scope.studentGridOptions.onRegisterApi = function(gridApi) {
    $scope.studentGridApi = gridApi;
    $scope.studentGridOptions.data = AbsenceRecord.listCurrent();
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, n, o) {
      if (n !== o) {
        switch (colDef.name) {
          case 'entries.student.iep':
            $scope.updateIEP(rowEntity.entries.student);
            break;
          case 'entries.student.cfa':
            $scope.updateCFA(rowEntity.entries.student);
            break;
        }
      }
    });

    // NOTE: Hack to default to expanded rows on initial load.
    // https://github.com/angular-ui/ui-grid/issues/3841
    $scope.studentGridOptions.data.$promise.then(function() {
      if ($scope.studentGridApi.treeBase.expandAllRows) {
        $timeout($scope.studentGridApi.treeBase.expandAllRows);
      }
    });
  };

  Outreach.current().$promise.then(function(res) {
    var counts = _.keyBy(res, '_id');
    $scope.calls = (counts['Phone Call'] || {}).count || 0;
    $scope.letters = (counts['Letter Sent'] || {}).count || 0;
    $scope.home = (counts['Home Visit'] || {}).count || 0;
    $scope.sst = (counts['SST Referral'] || {}).count || 0;
    $scope.court = (counts['Court Referral'] || {}).count || 0;
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
      $scope.filter = filter;
      $scope.studentGridOptions.data = AbsenceRecord.listCurrent($scope.filter);
      $scope.menuItems.length = 0;
      if (_.includes(['Phone Call', 'Letter Sent', 'Home Visit'], type)) {
        [].push.apply($scope.menuItems, [{
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
}

app.controller('DashboardCtrl', DashboardCtrl);
