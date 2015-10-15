'use strict';

angular.module('app').controller('NavbarCtrl',
  function($scope, $state, $rootScope, Auth, Sidebar, matchmedia) {
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

    var unregister = matchmedia.onPhone(function(mediaQueryList) {
      if (!mediaQueryList.matches) {
        $scope.isCollapsed = true;
      }
    });

    $scope.$on('$destroy', function() {
      unregister();
    });
  });
