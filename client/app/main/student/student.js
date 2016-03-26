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
      .state('somethings', {
        url: '/somethings',
        parent: 'student',
        templateUrl: 'app/main/student/partial/somethings.html',
        controller: 'StudentSomethingCtrl'
      })
      .state('outreaches', {
        url: '/outreaches',
        parent: 'student',
        templateUrl: 'app/main/student/partial/outreaches.html',
        controller: 'StudentOutreachesCtrl'
      });
  });
