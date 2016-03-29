'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('student.outreaches', {
    url: '/outreaches',
    parent: 'student',
    templateUrl: 'app/main/student/outreaches/outreaches.html',
    controller: 'StudentOutreachesCtrl'
  });
});
