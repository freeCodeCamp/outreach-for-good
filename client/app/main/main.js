'use strict';

angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('access', {
        templateUrl: 'app/main/access/access.html'
      })
      .state('access.guest', {
        url: '/guest',
        templateUrl: 'app/main/access/guest.html'
      })
      .state('access.forbidden', {
        url: '/forbidden/:required',
        templateUrl: 'app/main/access/forbidden.html',
        controller: 'ForbiddenCtrl'
      });
  });
