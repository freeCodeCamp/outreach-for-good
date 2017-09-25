'use strict';

function Visualization($resource) {
  return $resource('/api/visualizations/:controller/:id', {
    id: '@_id'
  });
}

angular.module('app').factory('Visualization', Visualization);
