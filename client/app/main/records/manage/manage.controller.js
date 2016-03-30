'use strict';

var app = angular.module('app');

function ManageCtrl($scope, AbsenceRecord, School) {
  $scope.selected = {};
  $scope.schools = School.query();

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
