'use strict';

function Intervention($resource) {
  return $resource(
    '/api/students/:studentId/interventions/:interventionId/:controller',
    {
      studentId: '@student',
      interventionId: '@_id'
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
}

angular.module('app').factory('Intervention', Intervention);
