'use strict';

var app = angular.module('app');

app.factory('AbsenceRecord', function($resource) {
  return $resource(
    '/api/absence-records/:recordId/:controller/:selector/:filter', {}, {
      current: {
        method: 'GET',
        isArray: true,
        params: {
          selector: 'current'
        }
      },
      listCurrent: {
        method: 'GET',
        isArray: true,
        params: {
          controller: 'list',
          selector: 'current'
        }
      }
    });
});
