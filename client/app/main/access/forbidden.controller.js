'use strict';

angular.module('app')
  .controller('ForbiddenCtrl', function($scope, $stateParams, Auth) {
    $scope.requiredRole = $stateParams.required;
    $scope.role = Auth.getCurrentUser().role;
  });
