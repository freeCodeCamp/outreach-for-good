'use strict';

var app = angular.module('app');

function SchoolReportsCtrl($scope) {
  $scope.tabs = [{
    text: 'At Risk',
    state: 'school-reports.at-risk'
  }, {
    text: 'Chronically Absent',
    state: 'school-reports.chronically-absent'
  }, {
    text: 'Outreaches',
    state: 'school-reports.outreach-summary'
  }, {
    text: 'Interventions',
    state: 'school-reports.intervention-summary'
  }];

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
