'use strict';

angular.module('app')
  .controller('SidebarCtrl', function($scope, SidebarService) {
    $scope.sidebar = SidebarService;
  });
