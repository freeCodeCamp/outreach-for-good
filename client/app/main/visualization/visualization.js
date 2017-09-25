'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('visualization', {
    url: '/visualization',
    parent: 'main',
    templateUrl: 'app/main/visualization/visualization.html',
    controller: 'VisualizationCtrl'
  });
});
