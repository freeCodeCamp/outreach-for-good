'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    parent: 'main',
    templateUrl: 'app/main/dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  });
});
