'use strict';

angular.module('app')
  .controller('ForbiddenCtrl', function($scope, $stateParams) {
    $scope.reason = $stateParams.reason;
  });
