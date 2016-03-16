'use strict';

angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('school-settings', {
        url: '/school/settings',
        parent: 'main',
        templateUrl: 'app/main/school/school.settings.html',
        controller: 'SchoolSettingsCtrl'
      })
      .state('school-reports', {
        url: '/school/reports',
        parent: 'main',
        templateUrl: 'app/main/school/school.reports.html',
        controller: 'SchoolReportsCtrl'
      });
  });
