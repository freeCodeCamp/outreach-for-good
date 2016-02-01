'use strict';

var app = angular.module('app');

app.factory('Student', function($resource) {
  return $resource('/api/students/:id/:controller', {
    id: '@_id'
  }, {
    list: {
      method: 'GET',
      isArray: true
    },
    updateIEP: {
      method: 'PUT',
      params: {
        controller: 'iep'
      }
    },
    updateCFA: {
      method: 'PUT',
      params: {
        controller: 'cfa'
      }
    }
  });
});
