'use strict';

angular.module('app')
  .config(function($stateProvider) {
    $stateProvider
      .state('student', {
        url: '/student/:id',
        parent: 'main',
        templateUrl: 'app/main/student/student.html',
        controller: 'StudentCtrl'
      })
      .state('outreaches', {
        url: '/outreaches',
        parent: 'student',
        templateUrl: 'app/main/student/partial/outreaches.html',
        controller: 'StudentOutreachesCtrl'
      })
      .state('interventions', {
        url: '/interventions',
        parent: 'student',
        templateUrl: 'app/main/student/partial/interventions.html',
        controller: 'StudentInterventionsCtrl'
      });
  });
