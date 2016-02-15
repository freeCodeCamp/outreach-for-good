'use strict';

var app = angular.module('app');

function MainCtrl($scope, Sidebar) {
  $scope.sidebar = Sidebar;
}

app.controller('MainCtrl', MainCtrl);
