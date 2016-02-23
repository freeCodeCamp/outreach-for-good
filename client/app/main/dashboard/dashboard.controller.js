'use strict';

var app = angular.module('app');

function DashboardCtrl($scope, Auth, AbsenceRecord, Intervention, Student,
  uiGridGroupingConstants, toastr) {
  $scope.studentGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, color: 'grey'},
    exporterPdfHeader: { text: 'Student Data', style: 'headerStyle' },
    exporterPdfOrientation: 'landscape',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true, color: '#265E6D' };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
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
    minWidth: 100,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.absencesDelta',
    displayName: 'Δ',
    width: 50
  }, {
    name: 'entries.tardies',
    displayName: 'Tardies',
    minWidth: 100,
    treeAggregationType: uiGridGroupingConstants.aggregation.SUM
  }, {
    name: 'entries.tardiesDelta',
    displayName: 'Δ',
    width: 50
  }, {
    name: 'entries.present',
    displayName: 'Present',
    minWidth: 100
  }, {
    name: 'entries.enrolled',
    displayName: 'Enrolled',
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
      sort: {priority: 0, direction: 'asc'}
    });
  } else {
    $scope.assignment = Auth.getCurrentUser().assignment;
  }

  $scope.studentGridOptions.onRegisterApi = function(gridApi) {
    $scope.studentGridApi = gridApi;
    $scope.studentGridOptions.data = AbsenceRecord.current();
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
  };

  $scope.$watch('selector', function(selector, old) {
    if (selector !== old) {
      $scope.studentGridOptions.data = AbsenceRecord.current({
        selector: selector
      });
    }
  });

  Intervention.current().$promise.then(function(res) {
    var counts = _.keyBy(res, '_id');
    $scope.calls = (counts['Phone Call'] || {}).count || 0;
    $scope.letters = (counts['Letter Sent'] || {}).count || 0;
    $scope.home = (counts['Home Visit'] || {}).count || 0;
    $scope.sst = (counts['SST Referral'] || {}).count || 0;
    $scope.court = (counts['Court Referral'] || {}).count || 0;
  });

  $scope.setSelector = function(selector) {
    $scope.selector = selector;
  };
}

app.controller('DashboardCtrl', DashboardCtrl);
