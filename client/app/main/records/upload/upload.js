'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('records.upload', {
    url: '/upload',
    parent: 'records',
    templateUrl: 'app/main/records/upload/upload.html',
    controller: 'UploadCtrl'
  });
});
