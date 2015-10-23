'use strict';

var app = angular.module('app');

app.factory('User', function($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    updateRole: {
      method: 'PUT',
      params: {
        controller: 'role'
      }
    },
    updateAssignment: {
      method: 'PUT',
      params: {
        controller: 'assignment'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
  });
});
