'use strict';

var app = angular.module('app');

function ManageCtrl($scope, $filter, AbsenceRecord, School, Modal, toastr) {
  $scope.selected = {};
  $scope.schools = School.query();

  $scope.delete = function(record, index) {
    if (index === 0) {
      var deleteFn = function(model) {
        return AbsenceRecord.remove({recordId: model.recordId}, function() {
          _.pull($scope.records, model);
          toastr.success(
            'Absence record for ' + $filter('date')(model.date, 'MM/dd/yy') +
            ' deleted.'
          );
        }, function(err) {
          console.log(err);
          toastr.error(err);
        });
      };
      Modal.confirmDeleteGuarded(
        'Delete Absence Record',
        'app/main/records/manage/modal.delete-record.html',
        record,
        deleteFn);
    }
  };

  $scope.$watch('selected.school', function(n, o) {
    if (n !== o) {
      delete $scope.records;
      AbsenceRecord.school({selector: $scope.selected.school._id},
        function(records) {
          $scope.records = records;
        });
    }
  });
}

app.controller('ManageCtrl', ManageCtrl);
