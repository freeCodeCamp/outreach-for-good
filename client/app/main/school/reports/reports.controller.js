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

  $scope.updateWithdrawn = function(student) {
    if (student._id) {
      var oldValue = !student.withdrawn;
      Student.updateWithdrawn({
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
  };

  $scope.menuItems = [{
    text: ' Withdrawn Students',
    action: function() {
      $scope.showWithdrawn = !$scope.showWithdrawn;
    },
    iconFn: function() {
      return $scope.showWithdrawn ?
             'fa-check-square-o text-success' : 'fa-square-o';
    }
  }];
}

app.controller('SchoolReportsCtrl', SchoolReportsCtrl);
