'use strict';

var app = angular.module('app');

function SchoolReports($scope, Auth, uiGridGroupingConstants,
	Student, AbsenceRecord) {
  $scope.officialRate = AbsenceRecord.curCAR();
  $scope.arca = AbsenceRecord.arca();
	$scope.chronicAbsentGridOptions = {
		enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, color: 'grey'},
    exporterPdfHeader: { text: 'Chronically Absent Students', style: 'headerStyle' },
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
	$scope.atRiskChronicAbsentGridOptions = {
		enableSorting: true,
    enableGridMenu: true,
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, color: 'grey'},
    exporterPdfHeader: { text: 'At Risk Chronically absent students', style: 'headerStyle' },
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
}

app.controller('SchoolReports', SchoolReports);
