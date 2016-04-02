'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('school-settings', {
    url: '/school/settings',
    parent: 'main',
    templateUrl: 'app/main/school/settings/settings.html',
    controller: 'SchoolSettingsCtrl'
  });
});
