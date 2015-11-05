'use strict';

angular.module('app')
  .controller('DashboardCtrl', function($scope, Students) {
    $scope.students = Students.list();

    $scope.letters = 45;
    $scope.calls = 3;
    $scope.home = 0;
    $scope.court = 4;
    $scope.sst = 20;
    $scope.studentGrid = {
      enableFiltering: true,
      // Prepopulated data that will be replaced by:
      // $http.get(/api/absence-reports/)
      data: $scope.students
    };
  });
