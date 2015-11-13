'use strict';

var app = angular.module('app');

app.controller('PDFUploadCtrl', function($scope, $http, Auth, Data, Upload) {
  $scope.isUploaded = false;
  var defaultSchool;

  $scope.isTeacher = Auth.getCurrentUser().role === 'teacher';
  if ($scope.isTeacher) {
    defaultSchool = Auth.getCurrentUser().assignment;
    $scope.schools = [defaultSchool];
  } else {
    $scope.schools = Data.schools();
  }

  $scope.forms = {};
  $scope.data = {upload: {school: defaultSchool}};

  $scope.upload = function(file) {
    return Upload.upload({
      url: '/api/pdfs/',
      data: {file: file, schoolId: $scope.data.upload.school._id}
    });
  };

  $scope.cancelUpload = function() {
    $scope.isUploaded = false;
    $scope.result.data = {};
    $scope.data.upload.message = "Upload Canceled";
  }

  $scope.confirmUpload = function() {
    $http.post('/api/absence-records/' + $scope.result.config.data.schoolId, 
      $scope.result.data).success(function(data) {
        $scope.data.upload.message = "Upload Confirmed!";
        $scope.result.data = {};
        $scope.isUploaded = false;
      });
  }

  $scope.submit = function() {
    delete $scope.data.upload.message;
    if ($scope.forms.upload.$valid) {
      $scope.data.upload.processingUpload = true;
      $scope.forms.upload.file.$setValidity('server', true);
      delete $scope.data.upload.fileError;

      $scope.upload($scope.data.upload.file).then(function(res) {
        if (res.status === 200) {
          $scope.data.upload = {school: defaultSchool};
          $scope.data.upload.message = "Confirm you want to upload the following..." ;
          $scope.result = res;
          $scope.forms.upload.$setPristine();   
          $scope.isUploaded = true;
        } else {
          $scope.forms.upload.file.$setValidity('server', false);
          $scope.data.upload.fileError = res.status + ': ' + res.statusText;
        }
        $scope.data.upload.processingUpload = false;
      });
    }
  };
});
