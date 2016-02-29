'use strict';

var app = angular.module('app');

function SchoolReports($scope, uiGridGroupingConstants) {
	$scope.studentGridOptions = {};
	$scope.chronicAbsentGridOptions = {};
	$scope.dalyAtttendanceGridOptions = {};
	$scope.firstCallGridOptions = {};
}

app.controller('SchoolReports', SchoolReports);
