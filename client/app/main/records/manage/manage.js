'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider.state('records.manage', {
    url: '/manage',
    parent: 'records',
    templateUrl: 'app/main/records/manage/manage.html',
    controller: 'ManageCtrl'
  });
});
