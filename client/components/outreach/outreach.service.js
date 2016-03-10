'use strict';

var app = angular.module('app');

app.factory('Outreach', function($resource) {
  return $resource('/api/outreaches/:id/:controller', {
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
