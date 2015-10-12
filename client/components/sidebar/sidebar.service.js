'use strict';

angular.module('app').factory('Sidebar', function(matchmedia) {
  var collapsed = true;

  function isCollapsed() {
    return collapsed;
  }

  function toggle() {
    collapsed = !collapsed;
  }

  matchmedia.onPhone(function(mediaQueryList) {
    collapsed = mediaQueryList.matches;
  });

  return {
    isCollapsed: isCollapsed,
    toggle: toggle
  };
});
