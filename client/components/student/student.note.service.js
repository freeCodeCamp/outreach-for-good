'use strict';

var app = angular.module('app');

app.factory('StudentNote', function($resource) {
  return $resource('/api/students/:studentId/notes/:noteId', {
    noteId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
});
