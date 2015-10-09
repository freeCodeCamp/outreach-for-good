'use strict';

angular.module('app')
  .controller('NavbarCtrl', function ($scope, $state, $rootScope, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'stateName': 'main'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $state.go('login');
    };

    $scope.isActive = function(stateName) {
      return $state.is(stateName);
    };

    $scope.toggleSidebar = function() {
      $rootScope.$broadcast('toggle-sidebar');
    }
  });
