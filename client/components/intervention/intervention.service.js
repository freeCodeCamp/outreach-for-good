'use strict';

var app = angular.module('app');

app.factory('Intervention', function($resource) {
  return $resource('/api/interventions/:id/:controller', {
    id: '@_id'
  }, {
    updateAction: {
      method: 'PUT',
      params: {
        controller: 'action'
      }
    }
  });
});
