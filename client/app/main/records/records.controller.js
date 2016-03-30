'use strict';

var app = angular.module('app');

function RecordsCtrl($scope, $state) {
  $scope.tabs = [{
    title: 'Upload',
    state: 'records.upload'
  }];

  $scope.tabs.selected = _.find($scope.tabs, {state: $state.$current.name});
}

app.controller('RecordsCtrl', RecordsCtrl);
