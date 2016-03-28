'use strict';

var app = angular.module('app');

function AdminCtrl($scope, $http, uiGridConstants, Auth, User, School,
  Modal, ROLES, toastr) {
  $scope.roles = ROLES.slice(0, ROLES.indexOf(Auth.getCurrentUser().role) + 1);
  $scope.auth = Auth;

  // Users

  $scope.userGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    rowHeight: 54,
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, color: 'grey'},
    exporterPdfHeader: { text: 'Admin Data', style: 'headerStyle' },
    exporterPdfOrientation: 'landscape',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
    exporterSuppressColumns: [ 'google.image.url', 'Actions' ],
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true, color: '#265E6D' };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
      return docDefinition;
    }
  };

  $scope.userGridOptions.columnDefs = [{
    name: 'google.image.url',
    displayName: '',
    width: 54,
    cellTemplate: 'app/main/admin/partial/cell.profile-image.html',
    cellTooltip: function(row) {
      return row.entity.name;
    },
    enableCellEdit: false,
    enableSorting: false,
    enableMenu: false,
    pinnedLeft: true
  }, {
    name: 'name',
    displayName: 'Name',
    minWidth: 150,
    enableCellEdit: false
  }, {
    name: 'email',
    displayName: 'Email Address',
    minWidth: 200,
    enableCellEdit: false
  }, {
    name: 'assignment',
    displayName: 'Assigned School',
    minWidth: 200,
    sortingAlgorithm: function(a, b, rowA, rowB) {
      var nulls = $scope.userGridApi.core.sortHandleNulls(a, b);
      if (nulls !== null) {
        return nulls;
      } else {
        var nameA = rowA.entity.assignment.name;
        var nameB = rowB.entity.assignment.name;
        if (nameA === nameB) {
          return 0;
        }
        return nameA < nameB ? -1 : 1;
      }
    },
    editableCellTemplate: 'app/main/admin/partial/cell.assignment.html',
    cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD.name }}</div>'
  }, {
    name: 'role',
    displayName: 'Role',
    width: 125,
    editableCellTemplate: 'app/main/admin/partial/cell.role.html'
  }, {
    name: 'Actions',
    width: 108,
    enableSorting: false,
    cellClass: 'action-col',
    cellTemplate: 'app/main/admin/partial/cell.action.html',
    enableCellEdit: false,
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
      User.updateRole({id: user._id}, {role: role}).$promise
        .then(function(updatedUser) {
          user.role = updatedUser.role;
          delete user.assignment;
          $scope.userGridApi.core.notifyDataChange(
            uiGridConstants.dataChange.EDIT);
        });
    };
    Modal.confirm.update(updateFn)(user.name, 'Role', user.role, role);
  };

  $scope.updateAssignment = function(assignment, user) {
    if ((user.assignment || {})._id === (assignment || {})._id) {
      return;
    }
    var updateFn = function() {
      User.updateAssignment({id: user._id}, {assignment: assignment}).$promise
        .then(function() {
          user.assignment = assignment;
          $scope.userGridApi.core.notifyDataChange(
            uiGridConstants.dataChange.EDIT);
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
  }, {
    name: 'Actions',
    width: 108,
    enableSorting: false,
    cellClass: 'action-col',
    cellTemplate: 'app/main/admin/partial/cell.action-school.html',
    enableCellEdit: false
  }];

  $scope.schoolGridOptions.onRegisterApi = function(gridApi) {
    $scope.schoolGridOptions = gridApi;
    $scope.schoolGridOptions.data = School.query();
  };

  $scope.archiveSchool = function(school) {
    var archiveSchoolFn = function() {
      School.archive({id: school._id}, function(res) {
        _.pull($scope.schoolGridOptions.data, school);
        toastr.warning(
          res.modified + ' students archived',
          res.school + ' archived',
          {timeOut: 10000}
        );
      });
    };
    Modal.confirm.archive(archiveSchoolFn)(school.name);
  };

  // Development

  $scope.reset = function() {
    var resetFn = function() {
      $http.delete('/api/devs/reset').then(function() {
        $scope.userGridOptions.data = User.query();
        $scope.schoolGridOptions.data = School.query();
      });
    };
    Modal.confirm.reset(resetFn)();
  };

  $scope.schoolMenuItems = [{
    text: 'Add New School',
    action: function() {
      var addSchoolFn = function(model) {
        return School.save({}, model, function() {
          $scope.schoolGridOptions.data = School.query();
        });
      };
      Modal.form('Add New School',
        'app/main/admin/partial/modal.add-school.html',
        addSchoolFn);
    }
  }];
}

app.controller('AdminCtrl', AdminCtrl);
