'use strict';

angular.module('app').service('Sidebar', function() {
  this.expanded = false;
  this.toggle = function() {
    this.expanded = !this.expanded;
  };
});
