'use strict';

var app = angular.module('app');

app.service('Data', function() {
  var _schools = [];
  var _entries = [];

  this.schools = function() {
    return _schools;
  };
  this.setSchools = function(schools) {
    _schools.length = 0;
    [].push.apply(_schools, schools);
  };

  this.entries = function() {
    return _entries;
  };
  this.setEntries = function(entries) {
    _entries.length = 0;
    [].push.apply(_entries, entries);
  };
});
