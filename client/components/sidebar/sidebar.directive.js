'use strict';

var app = angular.module('app');

app.directive('sidebar', function(matchmedia) {
  return {
    templateUrl: 'components/sidebar/sidebar.html',
    controller: 'SidebarCtrl',
    scope: {},
    restrict: 'E',
    link: function(scope) {
      var cleanup = matchmedia.onPhone(function(mediaQueryList) {
        if (mediaQueryList.matches) {
          scope.sidebar.isCollapsed = true;
        }
      });
      scope.$on('$destroy', function() {
        cleanup();
      });
    }
  };
});
