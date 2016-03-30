'use strict';

angular.module('app')
  .config(function($stateProvider) {
    $stateProvider
      .state('student', {
        url: '/student/:studentId',
        parent: 'main',
        abstract: '.outreaches',
        templateUrl: 'app/main/student/student.html',
        controller: 'StudentCtrl'
      })
      .state('student.notes', {
        url: '/notes',
        parent: 'student',
        templateUrl: 'app/main/student/partial/notes.html',
        controller: 'StudentNotesCtrl'
      });
  });
