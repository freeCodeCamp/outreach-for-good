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
        scope.sidebar.isCollapsed = mediaQueryList.matches;
      });
      scope.$on('$destroy', function() {
        cleanup();
      });
    }
  };
});
