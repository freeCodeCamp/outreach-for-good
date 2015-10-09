'use strict';

angular.module('app')
  .controller('LoginCtrl', function ($scope, $window) {
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
