'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('student.summary', {
    url: '/summary',
    parent: 'student',
    templateUrl: 'app/main/student/summary/summary.html',
    controller: 'StudentSummaryCtrl'
  });
});
