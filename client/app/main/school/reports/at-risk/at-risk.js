'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('school-reports.at-risk', {
    url: '/at-risk',
    parent: 'school-reports',
    templateUrl: 'app/main/school/reports/reports.table.html',
    controller: 'AtRiskReportCtrl'
  });
});
