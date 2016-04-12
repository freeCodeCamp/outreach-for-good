'use strict';

function ForbiddenCtrl($scope, $stateParams) {
  $scope.reason = $stateParams.reason;
}

angular.module('app').controller('ForbiddenCtrl', ForbiddenCtrl);
