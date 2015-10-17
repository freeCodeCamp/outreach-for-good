'use strict';

angular.module('app')
  .config(function($stateProvider) {
    $stateProvider
      .state('pdf-upload', {
        url: '/pdf-upload',
        parent: 'main',
        templateUrl: 'app/main/pdf-upload/pdf-upload.html',
        controller: 'PDFUploadCtrl'
      });
  });
