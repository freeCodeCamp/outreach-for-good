'use strict';

var app = angular.module('app');

function SchoolReportsCtrl($scope, Student) {
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

  $scope.updateIEP = Student.updateIEP;
  $scope.updateCFA = Student.updateCFA;
  $scope.updateWithdrawn = Student.updateWithdrawn;

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
