'use strict';

var app = angular.module('app');

app.factory('Student', function($resource) {
  return $resource('/api/students/:id', {
    id: '@_id'
  }, {
    list: {
      method: 'GET',
      isArray: true
    }
  });
});
