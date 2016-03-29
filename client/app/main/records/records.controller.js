'use strict';

var app = angular.module('app');

function RecordsCtrl($scope) {
  $scope.tabs = [{
    title: 'Upload',
    state: 'records.upload'
  }, {
    title: 'Manage',
    state: 'records.manage'
  }];
}

app.controller('RecordsCtrl', RecordsCtrl);
