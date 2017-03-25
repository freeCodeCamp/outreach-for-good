'use strict';

function AdminCtrl($scope, $http, uiGridConstants, Auth, User, School,
  Modal, Settings, ROLES, toastr) {
  $scope.roles = ROLES.slice(0, ROLES.indexOf(Auth.getCurrentUser().role) + 1);
  $scope.auth = Auth;

  // Users

  $scope.userGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    rowHeight: 54,
    exporterMenuPdf: false
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
    var old = user.role;
    var updateFn = function(model) {
      model.role = role;
      return User.updateRole({}, model).$promise.then(function(updated) {
        delete model.assignment;
        _.assign(model, updated);
        $scope.userGridApi.core.notifyDataChange(
          uiGridConstants.dataChange.EDIT);
        toastr.success(
          'Role successfully changed to: ' + model.role,
          model.name
        );
      }, function(err) {
        model.role = old;
        toastr.error(err);
      });
    };
    Modal.confirm.update(user, 'Role', user.role, role, updateFn);
  };

  $scope.updateAssignment = function(assignment, user) {
    if ((user.assignment || {})._id === assignment._id) {
      return;
    }
    var old = user.assignment;
    var updateFn = function(model) {
      model.assignment = assignment;
      return User.updateAssignment({}, model).$promise.then(function(updated) {
        delete model.assignment;
        _.assign(model, updated);
        $scope.userGridApi.core.notifyDataChange(
          uiGridConstants.dataChange.EDIT);
        toastr.success(
          'Assignment successfully changed to: ' + model.assignment.name,
          model.name
        );
      }, function(err) {
        model.assignment = old;
        toastr.error(err);
      });
    };
    Modal.confirm.update(user, 'Assigned School',
      (user.assignment || {}).name || 'None', assignment.name, updateFn);
  };

  $scope.deleteUser = function(user) {
    var deleteUserFn = function() {
      User.delete({}, user).$promise.then(function() {
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

  $scope.deleteSchool = function(school) {
    var deleteFn = function(model) {
      return School.delete({}, model, function() {
        _.pull($scope.schoolGridOptions.data, model);
        $scope.userGridOptions.data = User.query();
        toastr.error(
          'All related records and students deleted.',
          model.name + ' deleted',
          {timeOut: 10000}
        );
      }, function(err) {
        console.log(err);
        toastr.error(err);
      });
    };
    Modal.confirmDeleteGuarded(
      'Delete ' + school.name,
      'app/main/admin/partial/modal.delete-school.html',
      school,
      school.name,
      deleteFn);
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


  // Interventions
  $scope.interventionGridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    rowHeight: 54
  }
  $scope.interventionGridOptions.columnDefs = [
    {
      name: 'title',
      displayName: 'Title',
      minWidth: 300
    },
    {
      name: 'description',
      displayName: 'Description',
      minWidth: 300
    },
    {
      name: 'active',
      displayName: 'Active',
      minWidth: 100
    },
    {
      name: 'Actions',
      width: 108,
      enableSorting: false,
      cellClass: 'action-col',
      cellTemplate: 'app/main/admin/partial/cell.action-interventions.html',
      enableCellEdit: false
    }
  ];
  $scope.interventionGridOptions.onRegisterApi = function(gridApi) {
    $scope.interventionGridOptions = gridApi;
    $scope.interventionGridOptions.data = Settings.query();
  }

  $scope.interventionMenuItems = [{
    text: 'Add New Intervention',
    action: function() {
      var addInterventionFn = function(model) {
        return Settings.save({}, model, function() {
          $scope.interventionGridOptions.data = Settings.query();
        });
      };
      Modal.form('Add New Intervention',
        'app/main/admin/partial/modal.intervention-type.html',
        addInterventionFn);
    }
  }];
  $scope.updateIntervention = function(intervention) {
    console.log(intervention);
    var updateFn = function(model) {
      return Settings.update({}, model, function(response) {
        console.log(response);
      })
    }
    Modal.interventionEdit(
      'Edit Intervention',
      intervention,
      'app/main/admin/partial/modal.intervention-type.html',
      updateFn
    );
  }
  $scope.deleteIntervention = function(intervention) {
    console.log(intervention);
    var deleteFn = function(model) {
      return Settings.delete({}, model, function(response) {
        _.pull($scope.interventionGridOptions.data, model);
        toastr.error(
          'Deleted intervention ' + model.title
        );
      }, function(err) {
        console.log(err);
        toastr.error(err);
      });
    };
    Modal.confirmDelete(
      'Delete ' + intervention.title,
      'app/main/admin/partial/modal.delete-intervention.html',
      intervention,
      deleteFn);
  };
}

angular.module('app').controller('AdminCtrl', AdminCtrl);
