'use strict';

function MainCtrl($scope, Sidebar) {
  $scope.sidebar = Sidebar;
}

angular.module('app').controller('MainCtrl', MainCtrl);
