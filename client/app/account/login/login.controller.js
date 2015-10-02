'use strict';

angular.module('appApp')
  .controller('LoginCtrl', function ($scope, $window) {
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
