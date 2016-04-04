'use strict';

angular.module('app').directive('gridStatus', function() {
  return {
    templateUrl: 'components/grid-status/grid-status.html',
    scope: {
      loading: '=',
      gridApi: '='
    },
    restrict: 'E',
    controller: function($scope) {
      $scope.noRows = function() {
        return !$scope.gridApi.core.getVisibleRows($scope.gridApi.grid).length;
      };
    }
  };
});
