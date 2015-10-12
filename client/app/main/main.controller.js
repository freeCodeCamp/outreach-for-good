'use strict';

angular.module('app').controller('MainCtrl', function($scope, SidebarService) {
  $scope.sidebar = SidebarService;
});
