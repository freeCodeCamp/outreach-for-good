  'use strict';

var app = angular.module('app');

app.controller('PDFUploadCtrl',
  function($scope, AbsenceRecord, Auth, Data, Upload) {
    $scope.forms = {};
    $scope.isUploaded = false;
    $scope.schools = Data.schools;

    if (Auth.getCurrentUser().role === 'teacher') {
      $scope.defaultSchool = Auth.getCurrentUser().assignment;
    }

    $scope.data = {upload: {school: $scope.defaultSchool}};

    $scope.upload = function(file) {
      return Upload.upload({
        url: '/api/pdfs/',
        data: { file: file, 
                schoolId: $scope.data.upload.school._id, 
                date: $scope.date 
              }
      });
    };

    $scope.cancelUpload = function() {
      $scope.isUploaded = false;
      $scope.result.data = {};
      $scope.data.upload.message = 'Upload Cancelled';
    };

    $scope.confirmUpload = function() {
      AbsenceRecord.save({}, $scope.result.data, function() {
        $scope.data.upload.message = 'Upload Confirmed!';
        console.log($scope.result);
        $scope.result.data = {};
        $scope.isUploaded = false;
        Data.refreshEntries();
      }, function(err) {
        console.log(err);
        $scope.data.upload.message = 'Confirmation Error: ' + err;
      });
    };

    $scope.submit = function() {
      delete $scope.data.upload.message;
      if ($scope.forms.upload.$valid) {
        $scope.data.upload.processingUpload = true;
        $scope.forms.upload.file.$setValidity('server', true);
        delete $scope.data.upload.fileError;

        $scope.upload($scope.data.upload.file).then(function(res) {
          if (res.status === 200) {
            $scope.data.upload = {school: $scope.defaultSchool};
            $scope.data.upload.message =
              'Confirm you want to upload the following...';
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
