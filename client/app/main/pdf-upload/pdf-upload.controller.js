'use strict';

var app = angular.module('app');

app.controller('PDFUploadCtrl', function($scope, Upload) {
  $scope.forms = {};

  $scope.upload = function(file) {
    return Upload.upload({
      url: '/api/pdfs/',
      data: {file: file}
    });
  };

  $scope.submit = function() {
    if ($scope.forms.uploadForm.file.$valid && $scope.file) {
      $scope.processingUpload = true;
      $scope.upload($scope.file).then(function(response) {
        if (response.status === 204) {
          $scope.message = 'File Uploaded!';
          delete $scope.file;
        } else {
          $scope.errorMessage = response.status + ': ' + response.statusText;
        }
        $scope.processingUpload = false;
      });
    }
  };
});
