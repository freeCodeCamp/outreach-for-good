'use strict';

angular.module('appApp')
  .controller('NavbarCtrl', function ($scope, $state, Auth) {
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
  });
