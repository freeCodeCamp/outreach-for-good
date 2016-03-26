'use strict';

var app = angular.module('app');

app.factory('Intervention', function($resource) {
  return $resource('/api/interventions/:id/:controller', {
    id: '@_id'
  }, {
    createNote: {
      method: 'POST',
      params: {
        controller: 'note'
      }
    },
    updateArchived: {
      method: 'PUT',
      params: {
        controller: 'archived'
      }
    }
  });
});
