'use strict';

var app = angular.module('app');

app.factory('Outreach', function($resource) {
  return $resource('/api/outreaches/:id/:controller', {
    id: '@_id'
  }, {
    addNote: {
      method: 'POST',
      params: {
        controller: 'note'
      }
    }
  });
});
