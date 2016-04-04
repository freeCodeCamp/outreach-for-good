'use strict';

function SchoolSettingsCtrl($scope, Auth, School, toastr) {
  $scope.triggerOptions = _.range(1, 16);
  $scope.currentUser = Auth.getCurrentUser();
  $scope.userIs = Auth.userIs;

  if ($scope.currentUser.role === 'teacher') {
    $scope.selectedSchool = $scope.currentUser.assignment;
  } else {
    $scope.schools = School.query();
  }

  $scope.selectSchool = function(school) {
    $scope.selectedSchool = school;
  };

  $scope.updateTriggers = function(trigger) {
    School.updateTriggers($scope.selectedSchool).$promise.then(function() {
      toastr.success(
        $scope.selectedSchool.name + '\'s trigger for ' +
        trigger.type + ' ' + trigger.tier + ' updated to: ' +
        trigger.absences);
    }, function(err) {
      toastr.error(err);
    });
  };
}

angular.module('app').controller('SchoolSettingsCtrl', SchoolSettingsCtrl);
