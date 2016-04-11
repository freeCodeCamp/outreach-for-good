'use strict';

var app = angular.module('app');

app.directive('sidebar', function(matchmedia) {
  return {
    templateUrl: 'components/sidebar/sidebar.html',
    controller: 'SidebarCtrl',
    scope: {},
    restrict: 'E',
    link: function(scope) {
      function collapseSidebar(mediaQueryList) {
        if (mediaQueryList.matches) {
          scope.sidebar.expanded = false;
        }
      }
      var maxCleanup = matchmedia.on('(max-width: 1200px)', collapseSidebar);
      var minCleanup = matchmedia.on('(min-width: 1200px)', collapseSidebar);
      scope.$on('$destroy', function() {
        maxCleanup();
        minCleanup();
      });
    }
  };
});
