'use strict';

angular.module('app')
  .controller('DashboardCtrl', function($scope) {
    $scope.letters = 45;
    $scope.calls = 3;
    $scope.home = 0;
    $scope.court = 4;
    $scope.sst = 20;
    $scope.studentGrid = {
      enableFiltering: true,
      // Prepopulated data that will be replaced by:
      // $http.get(/api/absence-reports/)
      data: [{
        last: 'L1',
        first: 'F1',
        id: '100001',
        'All Absences': '1.0',
        Tdy: '0.0',
        Present: '15.0',
        Enrolled: '16.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L2',
        first: 'F2',
        id: '100002',
        'All Absences': '1.0',
        Tdy: '0.0',
        Present: '14.0',
        Enrolled: '15.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L3',
        first: 'F3',
        id: '100003',
        'All Absences': '1.0',
        Tdy: '0.0',
        Present: '21.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L4',
        first: 'F4',
        id: '100004',
        'All Absences': '0.0',
        Tdy: '0.0',
        Present: '1.0',
        Enrolled: '1.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L5',
        first: 'F5',
        id: '100005',
        'All Absences': '0.0',
        Tdy: '0.0',
        Present: '22.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L6',
        first: 'F6',
        id: '100006',
        'All Absences': '1.0',
        Tdy: '0.0',
        Present: '0.0',
        Enrolled: '1.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L7',
        first: 'F7',
        id: '100007',
        'All Absences': '1.0',
        Tdy: '0.0',
        Present: '21.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L8',
        first: 'F8',
        id: '100008',
        'All Absences': '0.0',
        Tdy: '2.0',
        Present: '22.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L9',
        first: 'F9',
        id: '100009',
        'All Absences': '4.0',
        Tdy: '2.0',
        Present: '18.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L10',
        first: 'F10',
        id: '100010',
        'All Absences': '1.0',
        Tdy: '0.0',
        Present: '21.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L11',
        first: 'F11',
        id: '100011',
        'All Absences': '0.0',
        Tdy: '0.0',
        Present: '22.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L12',
        first: 'F12',
        id: '100012',
        'All Absences': '0.0',
        Tdy: '0.0',
        Present: '22.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L13',
        first: 'F13',
        id: '100013',
        'All Absences': '0.0',
        Tdy: '0.0',
        Present: '22.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L14',
        first: 'F14',
        id: '100014',
        'All Absences': '0.0',
        Tdy: '1.0',
        Present: '22.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L15',
        first: 'F15',
        id: '100015',
        'All Absences': '0.0',
        Tdy: '0.0',
        Present: '22.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L16',
        first: 'F16',
        id: '100016',
        'All Absences': '0.0',
        Tdy: '1.0',
        Present: '22.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L17',
        first: 'F17',
        id: '100017',
        'All Absences': '0.0',
        Tdy: '2.0',
        Present: '22.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }, {
        last: 'L18',
        first: 'F18',
        id: '100018',
        'All Absences': '0.0',
        Tdy: '0.0',
        Present: '22.0',
        Enrolled: '22.0',
        'School Year': '2015 - 2016'
      }]
    };
  });
