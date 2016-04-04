'use strict';

var app = angular.module('app');

app.factory('Student', function($resource, toastr) {
  var resource = $resource('/api/students/:studentId/:controller', {
    studentId: '@_id'
  }, {
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
    updateWithdrawn: {
      method: 'PUT',
      params: {
        controller: 'withdrawn'
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

  return {
    get: resource.get,
    updateIEP: function(student) {
      if (student._id) {
        var oldVal = !student.iep;
        resource.updateIEP({
          studentId: student._id
        }, {
          iep: student.iep
        }, function() {
          toastr.success(
            'IEP updated to ' + student.iep,
            student.firstName + ' ' + student.lastName);
        }, function(err) {
          student.iep = oldVal;
          toastr.error(err);
        });
      }
    },
    updateCFA: function(student) {
      if (student._id) {
        var oldVal = !student.cfa;
        resource.updateCFA({
          studentId: student._id
        }, {
          cfa: student.cfa
        }, function() {
          toastr.success(
            'CFA updated to ' + student.cfa,
            student.firstName + ' ' + student.lastName);
        }, function(err) {
          student.cfa = oldVal;
          toastr.error(err);
        });
      }
    },
    updateWithdrawn: function(student) {
      if (student._id) {
        var oldValue = !student.withdrawn;
        resource.updateWithdrawn({
          studentId: student._id
        }, {
          withdrawn: student.withdrawn
        }, function() {
          toastr.success(
            'Withdrawn updated to ' + student.withdrawn,
            student.firstName + ' ' + student.lastName);
        }, function(err) {
          student.withdrawn = oldValue;
          toastr.error(err);
        });
      }
    },
    outreachCounts: function() {
      return resource.outreachCounts().$promise.then(function(counts) {
        return _(counts).keyBy('_id').mapValues('count').value();
      });
    },
    interventionSummary: resource.interventionSummary,
    outreachSummary: resource.outreachSummary
  };
});
