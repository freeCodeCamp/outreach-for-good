'use strict';

var app = angular.module('app');

app.factory('School', function($resource) {
  return $resource('/api/schools/:id/:controller', {
    id: '@_id'
  }, {
    list: {
      method: 'GET',
      isArray: true
    },
    students: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'students'
      }
    }
  });
});
