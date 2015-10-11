angular.module('app')
  .controller('SidebarCtrl', function ($scope, $state, Auth) {

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.bool = false;

    $scope.$on('toggle-sidebar', function(event, args) {
      $scope.bool === true ? $scope.bool = false : $scope.bool = true;      
    });
  });