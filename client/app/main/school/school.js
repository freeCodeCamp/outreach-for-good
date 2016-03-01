'use strict';

angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('school', {
        url: '/school',
        parent: 'main',
        templateUrl: 'app/main/school/school.html',
        controller: 'SchoolCtrl'
      });
  });
