'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('school-reports', {
    url: '/school/reports',
    parent: 'main',
    templateUrl: 'app/main/school/reports/reports.html',
    controller: 'SchoolReportsCtrl'
  });
});
