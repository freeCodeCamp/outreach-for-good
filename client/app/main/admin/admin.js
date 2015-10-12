'use strict';

angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        parent: 'main',
        templateUrl: 'app/main/admin/admin.html',
        controller: 'AdminCtrl',
        auth: { required: 'admin' }
      });
  });
