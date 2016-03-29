'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('records', {
    url: '/records',
    parent: 'main',
    abstract: '.upload',
    templateUrl: 'app/main/records/records.html',
    controller: 'RecordsCtrl'
  });
});
