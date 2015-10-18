'use strict';

var app = angular.module('app');

app.controller('AdminCtrl', function($scope, $http, Auth, User, Modal, ROLES) {

  $scope.roles = ROLES.slice(0, ROLES.indexOf(Auth.getCurrentUser().role) + 1);

  $scope.users = User.query();

  $scope.updateRole = function(user, role) {
    if (user.role === role) {
      return;
    }
    var updateFn = function() {
      User.updateRole({id: user._id}, {role: role})
        .$promise.then(function(updatedUser) {
          _.assign(user, updatedUser);
        });
    };
    Modal.confirm.update(updateFn)(user.name, 'Role', user.role, role);
  };

  $scope.delete = function(user) {
    var deleteFn = function() {
      User.remove({id: user._id}).$promise.then(function() {
        _.pull($scope.users, user);
      });
    };
    Modal.confirm.delete(deleteFn)(user.name);
  };
});
