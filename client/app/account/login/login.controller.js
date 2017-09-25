'use strict';

function LoginCtrl($scope, $window, $timeout) {
  $scope.$on('$viewContentLoaded', function() {
    $timeout(function() {
      $scope.isLoaded = true;
    });
  });

  $scope.loginOauth = function(provider) {
    $window.location.href = '/auth/' + provider;
  };
}

angular.module('app').controller('LoginCtrl', LoginCtrl);
