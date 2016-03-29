'use strict';

var app = angular.module('app');

function RecordsCtrl($scope) {
  $scope.tabs = [{
    title: 'Upload',
    state: 'records.upload'
  }];
}

app.controller('RecordsCtrl', RecordsCtrl);
