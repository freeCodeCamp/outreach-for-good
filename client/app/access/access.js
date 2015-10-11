'use strict';

angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('access', {
        abstract: true,
        templateUrl: 'app/access/access.html'
      })
      .state('guest', {
        url: '/guest',
        parent: 'access',
        templateUrl: 'app/access/guest.html'
      })
      .state('forbidden', {
        url: '/forbidden/:required',
        parent: 'access',
        templateUrl: 'app/access/forbidden.html',
        controller: 'ForbiddenCtrl'
      });
  });
