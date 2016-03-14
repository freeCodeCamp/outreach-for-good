'use strict';

angular.module('app').directive('tabHeading', function($state) {
  return {
    templateUrl: 'components/tab-heading/tab-heading.html',
    scope: {
      tabs: '=',
      menuItems: '='
    },
    restrict: 'E',
    link: function(scope) {
      scope.isCollapsed = true;
      scope.select = function(tab) {
        scope.tabs.selected = tab;
        scope.isCollapsed = true;
        $state.go(tab.state);
      };
    }
  };
});
