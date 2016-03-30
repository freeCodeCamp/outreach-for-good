'use strict';

angular.module('app').directive('tabHeading', function($state) {
  return {
    templateUrl: 'components/tab-heading/tab-heading.html',
    scope: {
      tabs: '=',
      menuItems: '='
    },
    restrict: 'E',
    controller: function($scope) {
      $scope.selected = _.find($scope.tabs, {state: $state.$current.name});
    },
    link: function(scope) {
      scope.isCollapsed = true;
      scope.select = function(tab) {
        scope.isCollapsed = true;
        $state.go(tab.state);
      };
    }
  };
});
