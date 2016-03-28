'use strict';

var app = angular.module('app');

app.factory('School', function($resource) {
  return $resource('/api/schools/:schoolId/:controller', {
    schoolId: '@_id'
  }, {
    students: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'students'
      }
    },
    archive: {
      method: 'PUT',
      params: {
        controller: 'archive'
      }
    },
    updateTriggers: {
      method: 'PUT',
      params: {
        controller: 'update-triggers'
      }
    }
  });
});
