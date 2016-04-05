'use strict';

var app = angular.module('app');

app.factory('Visualization', function($resource) {
  return $resource('/api/visualizations/:controller/:id', {
    id: '@_id'
  }, {
    schools: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'schools'
      }
    },
    arcaCa: {
      method: 'GET',
      params: {
        controller: 'cfa-vs-notcfa'
      }
    }
  });
});
