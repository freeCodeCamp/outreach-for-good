'use strict';

angular.module('app').factory('User', function($resource) {
  return $resource('/api/users/:userId/:controller', {
    userId: '@_id'
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
    me: {
      method: 'GET',
      params: {
        controller: 'me'
      }
    }
  });
});
