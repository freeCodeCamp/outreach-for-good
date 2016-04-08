'use strict';

var app = angular.module('app');

function RecordsCtrl($scope) {
  $scope.tabs = [{
    text: 'Upload',
    state: 'records.upload'
  }, {
    text: 'Manage',
    state: 'records.manage'
  }];
}

app.controller('RecordsCtrl', RecordsCtrl);
