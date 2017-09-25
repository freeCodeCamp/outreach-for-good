'use strict';

function SchoolReportsCtrl($scope, SchoolReportsMenu) {
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
  $scope.menuItems = SchoolReportsMenu.menuItems;
}

angular.module('app').controller('SchoolReportsCtrl', SchoolReportsCtrl);
