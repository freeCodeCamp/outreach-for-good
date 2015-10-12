'use strict';

angular.module('app').controller('MainCtrl', function($scope, Sidebar) {
  $scope.sidebar = Sidebar;
});
