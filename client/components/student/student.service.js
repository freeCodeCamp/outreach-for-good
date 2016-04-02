'use strict';

var app = angular.module('app');

app.factory('Student', function($resource) {
  return $resource('/api/students/:studentId/:controller', {
    studentId: '@_id'
  }, {
    list: {
      method: 'GET',
      isArray: true
    },
    updateIEP: {
      method: 'PUT',
      params: {
        controller: 'iep'
      }
    },
    updateCFA: {
      method: 'PUT',
      params: {
        controller: 'cfa'
      }
    },
    outreachCounts: {
      method: 'GET',
      params: {
        controller: 'outreach-counts'
      },
      isArray: true
    },
    interventionSummary: {
      method: 'GET',
      params: {
        controller: 'intervention-summary'
      },
      isArray: true
    },
    outreachSummary: {
      method: 'GET',
      params: {
        controller: 'outreach-summary'
      },
      isArray: true
    }
  });
});
