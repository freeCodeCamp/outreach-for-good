'use strict';

angular.module('app')
  .config(function($stateProvider) {
    $stateProvider
      .state('student', {
        url: '/student/:id',
        parent: 'main',
        templateUrl: 'app/main/student/student.html',
        controller: 'StudentCtrl'
      });
  });
