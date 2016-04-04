'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('school-reports.outreach-summary', {
    url: '/outreach-summary',
    parent: 'school-reports',
    templateUrl: 'app/main/school/reports/reports.table.html',
    controller: 'OutreachSummaryReportCtrl'
  });
});
