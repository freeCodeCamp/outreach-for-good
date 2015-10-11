'use strict';

angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        abstract: true,
        templateUrl: 'app/main/main.html'
      });
  });
