'use strict';

angular.module('app').controller('NavbarCtrl',
  function($scope, $state, $rootScope, Auth, SidebarService) {
    $scope.menu = [{
      'title': 'Home',
      'stateName': 'main'
    }];

    $scope.isCollapsed = true;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.sidebar = SidebarService;

    $scope.logout = function() {
      Auth.logout();
      $state.go('login');
    };

    $scope.isActive = function(stateName) {
      return $state.is(stateName);
    };

    $scope.showSidebarToggle = function() {
      return $state.includes('main');
    };
  });
