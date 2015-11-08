'use strict';

var app = angular.module('app');

app.controller('PDFUploadCtrl', function($scope, Upload) {
  $scope.forms = {};
  $scope.data = {};

  $scope.upload = function(file) {
    return Upload.upload({
      url: '/api/pdfs/',
      data: {file: file}
    });
  };

  $scope.submit = function() {
    delete $scope.data.upload.message;
    if ($scope.forms.upload.$valid) {
      $scope.data.upload.processingUpload = true;
      $scope.forms.upload.file.$setValidity('server', true);
      delete $scope.data.upload.fileError;

      $scope.upload($scope.data.upload.file).then(function(res) {
        if (res.status === 204) {
          $scope.data.upload = {};
          $scope.data.upload.message = 'File Uploaded!';
          $scope.forms.upload.$setPristine();
        } else {
          $scope.forms.upload.file.$setValidity('server', false);
          $scope.data.upload.fileError = res.status + ': ' + res.statusText;
        }
        $scope.data.upload.processingUpload = false;
      });
    }
  };
});
