'use strict';

function StudentNote($resource) {
  return $resource('/api/students/:studentId/notes/:noteId', {
    studentId: '@student',
    noteId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}

angular.module('app').factory('StudentNote', StudentNote);
