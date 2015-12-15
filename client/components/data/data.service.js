'use strict';

var app = angular.module('app');

app.service('Data', function(School, AbsenceRecord) {
  this.refreshSchools = function() {
    this.schools = School.query();
  };

  this.refreshEntries = function() {
    this.entries = AbsenceRecord.listCurrent();
  };

  this.initialize = function() {
    this.refreshSchools();
    this.refreshEntries();
  };
});
