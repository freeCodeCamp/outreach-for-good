'use strict';

function VisualizationCtrl($scope, $timeout, Sidebar, Visualization) {
  $scope.sidebar = Sidebar;
  Visualization.arcaCa(function(data) { console.log(data) });
  // $scope.statType = 'Cumulative';
  // $scope.truancyType = 'Absences';
  // $scope.chartConfig = {
  //   options: {
  //     chart: {
  //       zoomType: 'x',
  //       type: 'line'
  //     }
  //   },
  //   xAxis: {
  //     type: 'datetime',
  //     title: {
  //       text: 'Date'
  //     }
  //   },
  //   yAxis: {
  //     title: {
  //       text: $scope.truancyType
  //     },
  //     allowDecimals: $scope.truancyType === 'Average'
  //   },
  //   title: {
  //     text: $scope.statType + ' ' + $scope.truancyType + ' ' + 'Trends'
  //   },
  //   loading: false,
  //   func: function(chart) {
  //     $scope.chartObj = chart;
  //   }
  // };

  // Visualization.schools().$promise.then(function(results) {
  //   $scope.Cumulative = {
  //     Absences: [],
  //     Tardies: []
  //   };
  //   $scope.Average = {
  //     Absences: [],
  //     Tardies: []
  //   };
  //   _.forEach(results, function(school) {
  //     var cumulativeAbsencesData = [];
  //     var averageAbsencesData = [];
  //     var cumulativeTardiesData = [];
  //     var averageTardiesData = [];

  //     school.data = _.sortBy(school.data, function(record) {
  //       return record.date;
  //     });

  //     _.forEach(school.data, function(record) {
  //       var dt = new Date(record.date);
  //       var utcDt = Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate());
  //       cumulativeAbsencesData.push([utcDt, record.absences]);
  //       averageAbsencesData.push([utcDt, record.absences / record.count]);
  //       cumulativeTardiesData.push([utcDt, record.tardies]);
  //       averageTardiesData.push([utcDt, record.tardies / record.count]);
  //     });

  //     $scope.Cumulative.Absences.push({
  //       name: school._id.name,
  //       data: cumulativeAbsencesData
  //     });

  //     $scope.Average.Absences.push({
  //       name: school._id.name,
  //       data: averageAbsencesData
  //     });

  //     $scope.Cumulative.Tardies.push({
  //       name: school._id.name,
  //       data: cumulativeTardiesData
  //     });

  //     $scope.Average.Tardies.push({
  //       name: school._id.name,
  //       data: averageTardiesData
  //     });

  //     $scope.chartConfig.series = $scope[$scope.statType][$scope.truancyType];
  //   });
  // });

  // $scope.$watchGroup(['statType', 'truancyType'], function(n, o) {
  //   if (n !== o) {
  //     $scope.chartConfig.series = $scope[$scope.statType][$scope.truancyType];
  //     $scope.chartConfig.title.text =
  //       $scope.statType + ' ' + $scope.truancyType + ' ' + 'Trends';
  //     $scope.chartConfig.yAxis.title.text = $scope.truancyType;
  //   }
  // });

  // Timeout used to redraw the chart after animation delay of resizing the
  // sidebar.
  // $scope.$watch('sidebar.isCollapsed', function() {
  //   $timeout(function() {$scope.chartObj.reflow();}, 510);
  // });
}

angular.module('app').controller('VisualizationCtrl', VisualizationCtrl);
