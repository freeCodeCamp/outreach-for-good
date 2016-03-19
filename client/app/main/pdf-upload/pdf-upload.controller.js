'use strict';

var app = angular.module('app');

function PDFUploadCtrl($scope, PDF, AbsenceRecord, Auth, School, toastr) {
  function resetState() {
    delete $scope.pending;
    delete $scope.parsedRecord;
    delete $scope.file;
    $scope.date = Date.now();
    $scope.progress = 0;
    $scope.result = {};
    $scope.selected = {
      school: $scope.defaultSchool
    };
  }

  if (Auth.getCurrentUser().role === 'teacher') {
    $scope.defaultSchool = Auth.getCurrentUser().assignment;
  } else {
    $scope.schools = School.query();
  }
  $scope.datepickerOptions = {
    maxDate: Date.now()
  };
  resetState();

  $scope.uploadPDF = function() {
    $scope.pending = true;
    $scope.parsedRecord.date = $scope.date;
    $scope.parsedRecord.schoolId = $scope.selected.school._id;
    PDF.save({}, $scope.parsedRecord, function(res) {
      delete $scope.pending;
      $scope.result.data = res;
    });
  };

  $scope.cancelUpload = resetState;

  $scope.confirmUpload = function() {
    $scope.pending = true;
    AbsenceRecord.save({}, $scope.result.data, function(res) {
      resetState();
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
      resetState();
      console.log(err);
      toastr.error(err, {timeOut: 0, closeButton: true});
    });
  };

  $scope.$watch('file', function(n, o) {
    if (n !== o) {
      delete $scope.parsedRecord;
      $scope.progress = 0;
      if (n) {
        var promise = PDF.parse(n);
        promise.then(function(parsedRecord) {
          $scope.parsedRecord = parsedRecord;
        }, function(err) {
          // TODO: handle errors.
          console.log(err);
        }, function(progress) {
          $scope.progress = progress;
        });
      }
    }
  });
}

app.controller('PDFUploadCtrl', PDFUploadCtrl);
