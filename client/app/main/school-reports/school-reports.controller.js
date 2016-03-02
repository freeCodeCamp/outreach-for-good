'use strict';

var app = angular.module('app');

function SchoolReports($scope, Auth, uiGridGroupingConstants,
  Student, AbsenceRecord) {
  $scope.chronicAbsentGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, color: 'grey'},
    exporterPdfHeader: {
      text: 'Chronically Absent Students',
      style: 'headerStyle'
    },
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
  $scope.atRiskChronicAbsentGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, color: 'grey'},
    exporterPdfHeader: {
      text: 'At Risk Chronically absent students',
      style: 'headerStyle'
    },
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
  $scope.chronicAbsentGridOptions.columnDefs = [{
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
  $scope.atRiskChronicAbsentGridOptions.columnDefs = [{
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

  var curCAR = AbsenceRecord.curCAR();
  var arca = AbsenceRecord.arca();

  curCAR.$promise.then(function(data) {
    $scope.chronicAbsentGridOptions.data = data;
    $scope.curCARCount = data.length;
  });
  arca.$promise.then(function(data) {
    $scope.atRiskChronicAbsentGridOptions.data = data;
    $scope.arcaCount = data.length;
  });
}

app.controller('SchoolReports', SchoolReports);
