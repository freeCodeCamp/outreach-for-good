'use strict';

var app = angular.module('app');

app.factory('AbsenceRecord', function($resource) {
  return $resource('/api/absence-records/:id/:controller/:selector', {
    id: '@_id'
  }, {
    current: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'current'
      }
    }
  });
});
