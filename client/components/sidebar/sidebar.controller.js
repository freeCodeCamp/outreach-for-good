'use strict';

angular.module('app').controller('SidebarCtrl',
  function($scope, $state, $window, Auth, Sidebar, matchmedia) {
    $scope.states = [{
      name: 'dashboard',
      displayName: 'Dashboard',
      icon: 'fa-dashboard'
    }, {
      name: 'pdf-upload',
      displayName: 'Upload Absence Report',
      icon: 'fa-upload'
    }, {
      name: 'admin',
      displayName: 'Admin',
      icon: 'fa-wrench',
      requiredRole: 'admin'
    }];
    $scope.sidebar = Sidebar;
    $scope.active = function(state) {
      return $state.includes(state);
    };
    $scope.userIs = Auth.userIs;
    $scope.navigateTo = function(state) {
      if (matchmedia.isPhone()) {
        $scope.sidebar.toggle();
      }
      $state.go(state);
    };
  });
