'use strict';

angular.module('app').factory('Sidebar', function() {
  function Sidebar() {
    this.isCollapsed = true;
  }

  Sidebar.prototype.toggle = function() {
    this.isCollapsed = !this.isCollapsed;
  };

  return new Sidebar();
});
