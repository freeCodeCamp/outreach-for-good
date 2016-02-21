'use strict';

var app = angular.module('app');

function PDFUploadCtrl($scope, AbsenceRecord, Auth, School, Upload, toastr) {
  $scope.maxDate = Date.now();

  $scope.forms = {};
  $scope.date = Date.now();
  $scope.isUploaded = false;

  if (Auth.getCurrentUser().role === 'teacher') {
    $scope.defaultSchool = Auth.getCurrentUser().assignment;
    $scope.schools = [$scope.defaultSchool];
  } else {
    $scope.schools = School.query();
  }

  $scope.data = {upload: {school: $scope.defaultSchool}};

  $scope.upload = function(file) {
    return Upload.upload({
      url: '/api/pdfs/',
      data: {
        file: file,
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
    AbsenceRecord.save({}, $scope.result.data, function(res) {
      $scope.data.upload.message = 'Upload Confirmed!';
      $scope.result.data = {};
      $scope.date = Date.now();
      $scope.isUploaded = false;

      var schoolName = res.record.school.name;
      if (res.students.length) {
        toastr.success(
          res.students.length + ' new students added.',
          schoolName,
          {timeOut: 10000}
        );
      }
      toastr.success(
        [
          'Absence report with',
          res.record.entries.length,
          'entries added.'
        ].join(' '),
        schoolName,
        {timeOut: 10000}
      );
    }, function(err) {
      console.log(err);
      $scope.data.upload.message = 'Confirmation Error: ' + err;
    });
  };

  $scope.submit = function() {
    $scope.schoolName = $scope.data.upload.school.name;
    delete $scope.data.upload.message;
    if ($scope.forms.upload.$valid) {
      $scope.data.upload.processingUpload = true;
      $scope.forms.upload.file.$setValidity('server', true);
      delete $scope.data.upload.fileError;

      $scope.upload($scope.data.upload.file)
        .then(function(res) {
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
        })
        .catch(function(err) {
          $scope.forms.upload.file.$setValidity('server', false);
          $scope.data.upload.fileError = 
            'Error uploading PDF... Refresh page to try again.' + 
            '{ ' + err.status + ': ' + err.statusText + ' }';
          $scope.data.upload.processingUpload = false;
          // TODO: Find way to reset form so user doesn't have to refresh page
        });
    }
  };
}

app.controller('PDFUploadCtrl', PDFUploadCtrl);
