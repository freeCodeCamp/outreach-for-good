'use strict';

function School($resource) {
  return $resource('/api/schools/:schoolId/:controller', {
    schoolId: '@_id'
  }, {
    updateTriggers: {
      method: 'PUT',
      params: {
        controller: 'update-triggers'
      }
    }
  });
}

angular.module('app').factory('School', School);
