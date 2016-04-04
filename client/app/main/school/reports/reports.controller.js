'use strict';

var app = angular.module('app');

function SchoolReportsCtrl($scope, Student, toastr) {
  $scope.tabs = [{
    title: 'At Risk',
    state: 'school-reports.at-risk'
  }, {
    title: 'Chronically Absent',
    state: 'school-reports.chronically-absent'
  }, {
    title: 'Outreach Summary',
    state: 'school-reports.outreach-summary'
  }];

  $scope.updateIEP = function(student) {
    if (student._id) {
      var oldVal = !student.iep;
      Student.updateIEP({
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
  };

  $scope.updateCFA = function(student) {
    if (student._id) {
      var oldVal = !student.cfa;
      Student.updateCFA({
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
  };
}

app.controller('SchoolReportsCtrl', SchoolReportsCtrl);
