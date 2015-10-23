'use strict';

var app = angular.module('app');

function AdminCtrl($scope, Auth, User, School, Modal, ROLES) {
  $scope.roles = ROLES.slice(0, ROLES.indexOf(Auth.getCurrentUser().role) + 1);

  // Users

  $scope.userGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    rowHeight: 54
  };

  $scope.userGridOptions.columnDefs = [{
    name: 'name',
    displayName: 'Name',
    minWidth: 150,
    pinnedLeft: true
  }, {
    name: 'email',
    displayName: 'Email Address',
    minWidth: 200
  }, {
    name: 'assignment',
    displayName: 'Assigned School',
    minWidth: 200,
    cellClass: 'assignment-col',
    cellTemplate: 'app/main/admin/assignment-cell.html'
  }, {
    name: 'role',
    displayName: 'Role',
    width: 125,
    cellClass: 'role-col',
    cellTemplate: 'app/main/admin/role-cell.html'
  }, {
    name: 'Actions',
    width: 108,
    enableSorting: false,
    cellClass: 'action-col',
    cellTemplate: 'app/main/admin/action-cell.html'
  }];

  $scope.userGridOptions.onRegisterApi = function(gridApi) {
    $scope.userGridApi = gridApi;
    $scope.userGridOptions.data = User.query();
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

  $scope.updateAssignment = function(assignment, user) {
    if ((user.assignment || {})._id === (assignment || {})._id) {
      return;
    }
    var updateFn = function() {
      User.updateAssignment({id: user._id}, {assignment: assignment})
        .$promise.then(function() {
          user.assignment = assignment;
        });
    };
    Modal.confirm.update(updateFn)(user.name, 'Assigned School',
      (user.assignment || {}).name || 'None',
      (assignment || {}).name || 'None');
  };

  $scope.deleteUser = function(user) {
    var deleteUserFn = function() {
      User.remove({id: user._id}).$promise.then(function() {
        _.pull($scope.userGridOptions.data, user);
      });
    };
    Modal.confirm.delete(deleteUserFn)(user.name);
  };

  // Schools

  $scope.schoolGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    rowHeight: 54
  };

  $scope.schoolGridOptions.columnDefs = [{
    name: 'name',
    displayName: 'Name',
    minWidth: 300
  }];

  $scope.schoolGridOptions.onRegisterApi = function(gridApi) {
    $scope.schoolGridOptions = gridApi;
    $scope.schoolGridOptions.data = School.query();
  };

  $scope.addSchool = function() {
    var addSchoolFn = function(model) {
      return School.save({}, model, function(school) {
        $scope.schoolGridOptions.data.push(school);
      });
    };
    Modal.form('Add New School', 'app/main/admin/add-school-modal.html',
      addSchoolFn);
  };

  $scope.deleteSchool = function(school) {
    var deleteSchoolFn = function() {
      School.remove({id: school._id}).$promise.then(function() {
        _.pull($scope.schoolGridOptions.data, school);
      });
    };
    Modal.confirm.delete(deleteSchoolFn)(school.name);
  };
}

app.controller('AdminCtrl', AdminCtrl);
