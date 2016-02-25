'use strict';

angular.module('app')
  .config(function($stateProvider) {
    $stateProvider
      .state('about', {
        url: '/about',
        parent: 'main',
        templateUrl: 'app/main/about/about.html',
        controller: 'AboutCtrl'
      });
  });
