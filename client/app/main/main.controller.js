'use strict';

var app = angular.module('app');

function MainCtrl($scope, Data, Sidebar) {
  $scope.sidebar = Sidebar;
  Data.initialize();
}

app.controller('MainCtrl', MainCtrl);
