'use strict';

angular.module('app').controller('SidebarCtrl',
  function($scope, $state, Auth, Sidebar, matchmedia) {
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
      name: 'records',
      url: 'records',
      displayName: 'Records',
      icon: 'fa-file'
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
        if (matchmedia.is('(max-width: 1200px)')) {
          $scope.sidebar.toggle();
        }
        $state.go(state);
      }
    };
  });
