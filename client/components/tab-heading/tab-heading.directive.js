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
      $scope.$watch(function() {
        return $state.$current.name;
      }, function(stateName) {
        $scope.selected = _.find($scope.tabs, {state: stateName});
      });
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
