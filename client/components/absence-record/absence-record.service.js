'use strict';

angular.module('app').factory('AbsenceRecord', function($resource) {
  return $resource(
    '/api/absence-records/:recordId/:controller/:selector/:year/:filter', {}, {
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
      },
      list2015: {
        method: 'GET',
        isArray: true,
        params: {
          controller: 'list',
          selector: 'year',
          year: '2015-2016'
        }
      },
      list2016: {
        method: 'GET',
        isArray: true,
        params: {
          controller: 'list',
          selector: 'year',
          year: '2016-2017'
        }
      },
      students: {
        method: 'GET',
        isArray: true,
        params: {
          controller: 'students'
        }
      },
      school: {
        method: 'GET',
        isArray: true,
        params: {
          controller: 'school',
          filter: 'list'
        }
      }
    });
});
