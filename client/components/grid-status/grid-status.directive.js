'use strict';

angular.module('app').directive('gridStatus', function() {
  return {
    templateUrl: 'components/grid-status/grid-status.html',
    scope: {
      loading: '=',
      gridOptions: '='
    },
    restrict: 'E'
  };
});
