'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('school-reports.intervention-summary', {
    url: '/intervention-summary',
    parent: 'school-reports',
    templateUrl: 'app/main/school/reports/reports.table.html',
    controller: 'InterventionSummaryCtrl'
  });
});
