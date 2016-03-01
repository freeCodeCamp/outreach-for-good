'use strict';

angular.module('app').controller('SidebarCtrl',
  function($scope, $state, $window, Auth, Sidebar, matchmedia) {
    $scope.states = [{
      name: 'dashboard',
      url: 'dashboard',
      displayName: 'Dashboard',
      icon: 'fa-dashboard'
    }, {
      name: 'visualization',
      url: 'visualization',
      displayName: 'Data Visualization',
      icon: 'fa-area-chart'
    }, {
      name: 'student',
      displayName: 'Student',
      icon: 'fa-child'
    }, {
      name: 'pdf-upload',
      url: 'pdf-upload',
      displayName: 'Upload',
      icon: 'fa-upload'
    }, {
      name: 'admin',
      url: 'admin',
      displayName: 'Admin',
      icon: 'fa-wrench',
      requiredRole: 'admin'
    }, {
      name: 'about',
      url: 'about',
      displayName: 'About',
      icon: 'fa-question'
    }];
    $scope.sidebar = Sidebar;
    $scope.active = function(state) {
      return $state.includes(state);
    };
    $scope.userIs = Auth.userIs;
    $scope.navigateTo = function(state) {
      if (state) {
        if (matchmedia.isPhone()) {
          $scope.sidebar.toggle();
        }
        $state.go(state);
      }
    };
  });
