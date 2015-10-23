'use strict';

var app = angular.module('app');

app.service('School', function($resource) {
  return $resource('/api/schools/:id', {
    id: '@_id'
  });
});
