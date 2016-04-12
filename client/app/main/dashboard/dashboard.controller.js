'use strict';

function DashboardCtrl($scope, $timeout, AbsenceRecord, GridDefaults, Student) {
  function updateOutreachCounts() {
    Student.outreachCounts($scope.showWithdrawn).then(function(counts) {
      $scope.counts = counts;
    });
  }

  function updateSelected(controller, value) {
    var selectedRows = $scope.gridApi.selection.getSelectedRows();
    var students = _.keyBy(selectedRows, 'student._id');
    var studentIds = Object.keys(students);
    return Student.batchUpdate(studentIds, controller, value).$promise.then(
      function(updatedStudents) {
        _.forEach(updatedStudents, function(student) {
          students[student._id].student = student;
        });
        $scope.gridApi.core.refresh();
        return updatedStudents;
      });
  }

  function noSelectedItems() {
    return !$scope.gridApi.selection.getSelectedRows().length;
  }

  var defaultMenuItems = [{
    text: 'IEP selected',
    action: function() {
      updateSelected('iep', true);
    },
    icon: 'fa-plus-circle text-success',
    disabledFn: noSelectedItems
  }, {
    text: 'IEP selected',
    action: function() {
      updateSelected('iep', false);
    },
    icon: 'fa-minus-circle text-danger',
    disabledFn: noSelectedItems
  }, {
    separator: true,
    text: 'CFA selected',
    action: function() {
      updateSelected('cfa', true);
    },
    icon: 'fa-plus-circle text-success',
    disabledFn: noSelectedItems
  }, {
    text: 'CFA selected',
    action: function() {
      updateSelected('cfa', false);
    },
    icon: 'fa-minus-circle text-danger',
    disabledFn: noSelectedItems
  }, {
    separator: true,
    text: 'Withdraw selected',
    action: function() {
      updateSelected('withdrawn', true).then(function() {
        $scope.$broadcast('withdrawn-updated');
        // Clear selection if withdrawn students are not being shown. Hidden
        // rows remain selected by default. Clear to avoid accidental updates.
        if (!$scope.showWithdrawn) {
          $scope.gridApi.selection.clearSelectedRows();
        }
      });
    },
    icon: 'fa-plus-circle text-success',
    disabledFn: noSelectedItems
  }, {
    text: 'Withdraw selected',
    action: function() {
      updateSelected('withdrawn', false).then(function() {
        $scope.$broadcast('withdrawn-updated');
      });
    },
    icon: 'fa-minus-circle text-danger',
    disabledFn: function() {
      return !$scope.showWithdrawn || noSelectedItems();
    }
  }, {
    separator: true,
    text: 'Withdrawn Students',
    action: function() {
      $scope.showWithdrawn = !$scope.showWithdrawn;
      var defs = $scope.gridOptions.columnDefs;
      _.find(defs, {displayName: 'Withdrawn'}).visible = $scope.showWithdrawn;
      if (!$scope.showWithdrawn) {
        $scope.gridApi.selection.clearSelectedRows();
      }
      $scope.gridApi.core.refresh();
    },
    iconFn: function() {
      return $scope.showWithdrawn ?
             'fa-check-square-o text-success' : 'fa-square-o';
    }
  }];
  
  updateOutreachCounts();
  $scope.menuItems = _.concat([], defaultMenuItems);
  $scope.filter = {};
  $scope.loading = true;
  $scope.csvFileNameFn = function() {
    return GridDefaults.datePrefix() + ' ' + $scope.tableTitle() + '.csv';
  };
  $scope.gridOptions = GridDefaults.recordOptions($scope);
  $scope.setFilter = function(type, tier) {
    if ($scope.filter.type !== type || $scope.filter.tier !== tier) {
      var filter = {};
      if (type) {
        filter.filter = 'query';
        filter.type = type;
        if (tier) {
          filter.tier = tier;
        }
      }
      $scope.loading = true;
      $scope.filter = filter;
      $scope.gridOptions.data = AbsenceRecord.listCurrent($scope.filter);
      $scope.gridOptions.data.$promise.then(function(data) {
        _.forEach(data, function(row) {
          row.updated = function() {
            return row.entry.date || row.date;
          };
        });
        $scope.loading = false;
        $timeout($scope.gridApi.treeBase.expandAllRows);
      });
      $scope.menuItems.length = 0;
      [].push.apply($scope.menuItems, defaultMenuItems);
      if (_.includes(['Phone Call', 'Letter Sent', 'Home Visit'], type)) {
        [].push.apply($scope.menuItems, [{
          separator: true,
          text: type + ' #1',
          action: function() {$scope.setFilter(type, 1);}
        }, {
          text: type + ' #2',
          action: function() {$scope.setFilter(type, 2);}
        }, {
          text: type + ' #3',
          action: function() {$scope.setFilter(type, 3);}
        }, {
          separator: true,
          text: type + ' (All)',
          action: function() {$scope.setFilter(type);}
        }]);
      }
    }
  };
  $scope.tableTitle = function() {
    return 'Students' +
           ($scope.filter.type ? ' (' + $scope.filter.type +
           ($scope.filter.tier ? ' #' + $scope.filter.tier : '') + ')' : '');
  };
  $scope.$on('withdrawn-updated', updateOutreachCounts);
  $scope.$watch('showWithdrawn', function(n, o) {
    if (n !== o) {
      updateOutreachCounts();
      $scope.gridApi.grid.refresh();
      $timeout($scope.gridApi.treeBase.expandAllRows);
    }
  });
}

angular.module('app').controller('DashboardCtrl', DashboardCtrl);
