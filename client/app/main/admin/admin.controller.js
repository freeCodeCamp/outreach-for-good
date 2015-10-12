'use strict';

angular.module('app')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, ROLES) {

    $scope.roles = ROLES.slice(0, ROLES.indexOf(Auth.getCurrentUser().role)+1);

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.updateRole = function(user, role) {
      User.updateRole({ id: user._id }, { role: role })
        .$promise.then(function(updatedUser) {
          _.assign(user, updatedUser);
        });
    };

    $scope.delete = function(user) {
      User.remove({ id: user._id })
        .$promise.then(function() {
          _.pull($scope.users, user);
        });
    };
  });
