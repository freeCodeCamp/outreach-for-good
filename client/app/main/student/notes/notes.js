'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('student.notes', {
    url: '/notes',
    parent: 'student',
    templateUrl: 'app/main/student/notes/notes.html',
    controller: 'StudentNotesCtrl'
  });
});
