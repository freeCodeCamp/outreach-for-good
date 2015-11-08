'use strict';

var app = angular.module('app');

app.controller('PDFUploadCtrl', function($scope, Auth, Data, Upload) {
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

  $scope.submit = function() {
    delete $scope.data.upload.message;
    if ($scope.forms.upload.$valid) {
      $scope.data.upload.processingUpload = true;
      $scope.forms.upload.file.$setValidity('server', true);
      delete $scope.data.upload.fileError;

      $scope.upload($scope.data.upload.file).then(function(res) {
        if (res.status === 204) {
          $scope.data.upload = {school: defaultSchool};
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
