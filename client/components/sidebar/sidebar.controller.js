'use strict';

angular.module('app').controller('SidebarCtrl',
  function($scope, $state, $window, Auth, Sidebar) {
    $scope.sidebar = Sidebar;
    $scope.active = function(state) {
      return $state.includes(state);
    };
    $scope.userIs = Auth.userIs;
    $scope.states = [{
      name: 'dashboard',
      displayName: 'Dashboard',
      icon: 'fa-dashboard'
    }, {
      name: 'admin',
      displayName: 'Admin',
      icon: 'fa-wrench',
      requiredRole: 'admin'
    }];
  });
