'use strict';

function VisualizationCtrl($scope, $timeout, Sidebar, Visualization) {
  $scope.sidebar = Sidebar;
  $scope.studentType = 'nonCfa';
  $scope.data = { 
    cfa: { arca: 0, ca: 0, other: 0 }, 
    nonCfa: { arca: 0, ca: 0, other: 0 } 
  };
  $scope.chartConfig = {
    options: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'ARCA vs CA'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          },
          showInLegend: true
        }
      }
    },
    func: function(chart) {
      $scope.chartObj = chart;
    }
  };

  Visualization.arcaCa().$promise.then(function(results) {
    function counter(rec, isCfa) {
      var key = isCfa ? 'cfa' : 'nonCfa';
      if(rec.arca) { 
        $scope.data[key].arca++; 
      } else if(rec.ca) { 
        $scope.data[key].ca++; 
      } else { 
        $scope.data[key].other++; 
      }
    }    
    _.forEach(results, function(record, key) {
      if(record.student.cfa) { 
        counter(record, true);
      } else {
        counter(record, false);
      }
    });
    
    function getTwoDecimals(n, t) {
      return parseInt(((n / t) * 100).toFixed(2), 10);
    }
    _.forEach(['cfa', 'nonCfa'], function(k) {
      var tot = $scope.data[k].arca + $scope.data[k].ca + $scope.data[k].other;
      if(tot) {
        _.forEach($scope.data[k],function(v, kB) {
          $scope.data[k][kB] = getTwoDecimals($scope.data[k][kB], tot);
        });
      } else {
        _.forEach($scope.data[k],function(v, kB) {
          $scope.data[k][kB] = 0;
        });
      }
    });
    
    $scope.chartConfig.series = [{
      name: $scope.studentType === 'cfa' ? 
        'A CFA student' : 'Not a CFA student',
      colorByPoint: true,
      data: [{
          name: 'ARCA',
          y: $scope.data[$scope.studentType].arca
        },{
          name: 'CA',
          y: $scope.data[$scope.studentType].ca
        }, {
          name: 'Other',
          y: $scope.data[$scope.studentType].other
      }]
    }];
  });

  $scope.$watch('studentType', function(n, o) {
    if(n !== o) {
      $scope.chartConfig.series = [{
        name: n === 'cfa' ? 'A CFA student' : 'Not a CFA student',
        colorByPoint: true,
        data: [{
            name: 'ARCA',
            y: $scope.data[n].arca
          },{
            name: 'CA',
            y: $scope.data[n].ca
          }, {
            name: 'Other',
            y: $scope.data[n].other
        }]
      }];
    }
  });
  // Timeout used to redraw the chart after animation delay of resizing the
  // sidebar.
  $scope.$watch('sidebar.isCollapsed', function() {
    $timeout(function() {$scope.chartObj.reflow();}, 510);
  });
}

angular.module('app').controller('VisualizationCtrl', VisualizationCtrl);
