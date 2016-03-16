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
      name: 'pdf-upload',
      url: 'pdf-upload',
      displayName: 'Upload',
      icon: 'fa-upload'
    }, {
      name: 'school-reports',
      url: 'school-reports',
      displayName: 'School Reports',
      icon: 'fa-graduation-cap'
    }, {
      name: 'school-settings',
      url: 'school-settings',
      displayName: 'School Settings',
      icon: 'fa-cogs'
    }, {
      name: 'admin',
      url: 'admin',
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
      if (state) {
        if (matchmedia.isPhone()) {
          $scope.sidebar.toggle();
        }
        $state.go(state);
      }
    };
  });
