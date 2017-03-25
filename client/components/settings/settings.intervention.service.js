'use strict';

function Settings($resource) {
  return $resource('/api/settings/intervention/types/:typeId', {
    typeId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}

angular.module('app').factory('Settings', Settings);
