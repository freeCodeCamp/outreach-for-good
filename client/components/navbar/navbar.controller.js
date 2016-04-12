'use strict';

function NavbarCtrl($scope, $state, $rootScope, Auth, Sidebar) {
  $scope.isCollapsed = true;
  $scope.getCurrentUser = Auth.getCurrentUser;
  $scope.sidebar = Sidebar;

  $scope.logout = function() {
    Auth.logout();
    $state.go('login');
  };

  $scope.showSidebarToggle = function() {
    return $state.includes('main');
  };
}

angular.module('app').controller('NavbarCtrl', NavbarCtrl);
