'use strict';

var app = angular.module('app');

app.factory('School', function($resource) {
  return $resource('/api/schools/:schoolId/:controller', {
    schoolId: '@_id'
  }, {
    updateTriggers: {
      method: 'PUT',
      params: {
        controller: 'update-triggers'
      }
    }
  });
});
