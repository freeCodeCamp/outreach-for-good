'use strict';

angular.module('app').service('SidebarService', function() {
  this.isCollapsed = true;
  this.toggle = function() {
    this.isCollapsed = !this.isCollapsed;
  };
});
