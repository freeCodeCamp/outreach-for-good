'use strict';

function RecordsCtrl($scope) {
  $scope.tabs = [{
    text: 'Upload',
    state: 'records.upload'
  }, {
    text: 'Manage',
    state: 'records.manage'
  }];
}

angular.module('app').controller('RecordsCtrl', RecordsCtrl);
