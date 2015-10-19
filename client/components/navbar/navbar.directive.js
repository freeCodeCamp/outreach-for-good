'use strict';

var app = angular.module('app');

app.directive('navbar', function(matchmedia) {
  return {
    templateUrl: 'components/navbar/navbar.html',
    controller: 'NavbarCtrl',
    scope: {},
    restrict: 'E',
    link: function(scope) {
      var cleanup = matchmedia.onPhone(function(mediaQueryList) {
        if (!mediaQueryList.matches) {
          scope.isCollapsed = true;
        }
      });
      scope.$on('$destroy', function() {
        cleanup();
      });
    }
  };
});
