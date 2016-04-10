'use strict';

var app = angular.module('app');

app.factory('Visualization', function($resource) {
  return $resource('/api/visualizations/:controller/:id', {
    id: '@_id'
  });
});
