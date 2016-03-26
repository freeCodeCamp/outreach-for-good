'use strict';

var app = angular.module('app');

app.factory('Outreach', function($resource) {
  return $resource('/api/outreaches/:id/:controller', {
    id: '@_id'
  }, {
    updateAction: {
      method: 'PUT',
      params: {
        controller: 'action'
      }
    },
    addNote: {
      method: 'POST',
      params: {
        controller: 'note'
      }
    },
    current: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'current'
      }
    }
  });
});
