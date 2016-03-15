'use strict';

angular.module('app')
  .controller('LoginCtrl', function ($scope, $window, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
      $timeout(function() {
        $scope.isLoaded = true;
      });
    });

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
