'use strict';

var app = angular.module('app');

app.factory('AbsenceRecord', function($resource) {
  return $resource('/api/absence-records/:id/:controller/:selector/:filter', {
    id: '@_id'
  }, {
    current: {
      method: 'GET',
      isArray: true,
      params: {
        selector: 'current'
      }
    },
    listCurrent: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'list',
        selector: 'current'
      }
    }
  });
});
