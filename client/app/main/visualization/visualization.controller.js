'use strict';

function VisualizationCtrl($scope, $timeout, Sidebar, Visualization) {
  $scope.sidebar = Sidebar;
  $scope.studentType = 'nonCfa';
  $scope.data = { 
    cfa: { 
      arca: {
        count: 0, pct: 0
      }, 
      ca: {
        count: 0, pct: 0
      }, 
      other: {
        count: 0, pct: 0
      } 
    }, 
    nonCfa: { 
      arca: {
        count: 0, pct: 0
      }, 
      ca: {
        count: 0, pct: 0
      }, 
      other: {
        count: 0, pct: 0
      } 
    } 
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
        pointFormat: '{series.name}<br><b>{point.percentage:.1f}%</b><br><em>{point.count} tot.</em>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
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
        $scope.data[key].arca.count++; 
      } else if(rec.ca) { 
        $scope.data[key].ca.count++; 
      } else { 
        $scope.data[key].other.count++; 
      }
    }    
    _.forEach(results, function(record) {
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
      var tot = $scope.data[k].arca.count + $scope.data[k].ca.count + $scope.data[k].other.count;
      if(tot) {
        _.forEach($scope.data[k],function(v, kB) {
          $scope.data[k][kB].pct = getTwoDecimals($scope.data[k][kB].count, tot);
        });
      } else {
        _.forEach($scope.data[k],function(v, kB) {
          $scope.data[k][kB].pct = 0;
        });
      }
    });
    
    $scope.chartConfig.series = [{
      name: $scope.studentType === 'cfa' ? 
        'A CFA student' : 'Not a CFA student',
      colorByPoint: true,
      data: [{
          name: 'ARCA',
          y: $scope.data[$scope.studentType].arca.pct,
          count: $scope.data[$scope.studentType].arca.count
        },{
          name: 'CA',
          y: $scope.data[$scope.studentType].ca.pct,
          count: $scope.data[$scope.studentType].ca.count
        }, {
          name: 'Other',
          y: $scope.data[$scope.studentType].other.pct,
          count: $scope.data[$scope.studentType].other.count
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
            y: $scope.data[n].arca.pct,
            count: $scope.data[n].arca.count
          },{
            name: 'CA',
            y: $scope.data[n].ca.pct,
            count: $scope.data[n].ca.count
          }, {
            name: 'Other',
            y: $scope.data[n].other.pct,
            count: $scope.data[n].other.count
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
