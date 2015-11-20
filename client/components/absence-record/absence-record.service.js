'use strict';

var app = angular.module('app');

app.factory('AbsenceRecord', function($resource) {
  return $resource('/api/absence-records/:id/:controller', {
    id: '@_id'
  });
});
