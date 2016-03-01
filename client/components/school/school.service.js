'use strict';

var app = angular.module('app');

app.factory('School', function($resource) {
  return $resource('/api/schools/:id/:controller', {
    id: '@_id'
  }, {
    students: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'students'
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
