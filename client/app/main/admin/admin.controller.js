'use strict';

var app = angular.module('app');

app.controller('AdminCtrl',
  function($scope, $http, $templateCache, Auth, User, Modal, ROLES) {

    $scope.roles =
      ROLES.slice(0, ROLES.indexOf(Auth.getCurrentUser().role) + 1);

    User.query().$promise.then(function(res) {
      $scope.userGridOptions.data = res;
    });

    $scope.userGridOptions = {
      enableSorting: true,
      enableGridMenu: true,
      rowHeight: 54
    };

    $scope.userGridOptions.columnDefs = [{
      name: 'name',
      displayName: 'Name',
      minWidth: 150,
      pinnedLeft: true,
      enableCellEdit: false
    }, {
      name: 'email',
      displayName: 'Email Address',
      minWidth: 200,
      enableCellEdit: false
    }, {
      name: 'role',
      displayName: 'Role',
      minWidth: 125,
      cellClass: 'role-col',
      cellTemplate: 'app/main/admin/role-cell.html'
    }, {
      name: 'Actions',
      width: 108,
      enableCellEdit: false,
      enableSorting: false,
      cellClass: 'action-col',
      cellTemplate: 'app/main/admin/action-cell.html'
    }];

    $scope.userGridOptions.onRegisterApi = function(gridApi) {
      $scope.userGridApi = gridApi;
    };

    $scope.updateRole = function(role, user) {
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
          _.pull($scope.userGridOptions.data, user);
        });
      };
      Modal.confirm.delete(deleteFn)(user.name);
    };
  });

