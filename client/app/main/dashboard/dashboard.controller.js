'use strict';

angular.module('app')
  .controller('DashboardCtrl', function($scope) {
    $scope.letters = 45;
    $scope.calls = 3;
    $scope.home = 0;
    $scope.court = 4;
    $scope.sst = 20;
  });
