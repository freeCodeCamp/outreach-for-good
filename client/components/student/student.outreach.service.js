'use strict';

function Outreach($resource) {
  return $resource(
    '/api/students/:studentId/outreaches/:outreachId/:controller',
    {
      studentId: '@student',
      outreachId: '@_id'
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
}

angular.module('app').factory('Outreach', Outreach);
