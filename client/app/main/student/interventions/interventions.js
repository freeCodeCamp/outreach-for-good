'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('student.interventions', {
    url: '/interventions',
    parent: 'student',
    templateUrl: 'app/main/student/interventions/interventions.html',
    controller: 'StudentInterventionsCtrl'
  });
});
