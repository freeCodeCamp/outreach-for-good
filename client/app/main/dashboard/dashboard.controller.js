'use strict';

var app = angular.module('app');

function DashboardCtrl($scope, $timeout, AbsenceRecord, GridDefaults, Student) {
  $scope.filter = {};
  $scope.loading = true;

  $scope.gridOptions = GridDefaults.recordOptions($scope);

  Student.outreachCounts().then(function(counts) {
    $scope.counts = counts;
  });

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
      $scope.menuItems.length = 1;
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

  $scope.menuItems = [{
    text: ' Withdrawn Students',
    action: function() {
      $scope.showWithdrawn = !$scope.showWithdrawn;
    },
    iconFn: function() {
      return $scope.showWithdrawn ?
             'fa-check-square-o text-success' : 'fa-square-o';
    }
  }];

  $scope.$watch('showWithdrawn', function(n, o) {
    if (n !== o) {
      Student.outreachCounts().then(function(counts) {
        $scope.counts = counts;
      });
      $scope.gridApi.grid.refresh();
      $timeout($scope.gridApi.treeBase.expandAllRows);
    }
  });
}

app.controller('DashboardCtrl', DashboardCtrl);
