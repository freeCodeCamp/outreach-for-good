'use strict';

var app = angular.module('app');

app.factory('StudentNote', function($resource) {
  return $resource('/api/students/:studentId/notes/:noteId', {
    studentId: '@student',
    noteId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
});
