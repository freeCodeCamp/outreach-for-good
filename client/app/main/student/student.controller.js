'use strict';

var app = angular.module('app');

app.controller('StudentCtrl', function($scope, $stateParams, Student) {
  $scope.student = Student.get({id: $stateParams.id});
});
