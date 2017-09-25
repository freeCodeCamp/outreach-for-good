'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('school-reports.chronically-absent', {
    url: '/chronically-absent',
    parent: 'school-reports',
    templateUrl: 'app/main/school/reports/reports.table.html',
    controller: 'ChronicallyAbsentReportCtrl'
  });
});
