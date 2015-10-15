'use strict';

angular.module('app')
  .config(function($stateProvider) {
    $stateProvider
      .state('PDFUpload', {
        url: '/PDFUpload',
        parent: 'main',
        templateUrl: 'app/main/PDFUpload/PDFUpload.html',
        controller: 'PDFUploadCtrl'
      });
  });
