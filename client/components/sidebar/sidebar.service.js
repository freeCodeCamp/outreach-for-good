'use strict';

function Sidebar() {
  this.expanded = false;
  this.toggle = function() {
    this.expanded = !this.expanded;
  };
}

angular.module('app').service('Sidebar', Sidebar);
