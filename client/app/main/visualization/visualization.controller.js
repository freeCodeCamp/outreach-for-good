'use strict';

var defaultChartConfig, categorySettings, dataToSeries;

function VisualizationCtrl($scope, $timeout, School, Sidebar, Visualization) {
  $scope.sidebar = Sidebar;
  $scope.selected = {};
  School.query({controller: 'names'}, function(schools) {
    if (schools.length > 1) {
      schools.push({_id: 'combined', name: 'Combined'});
    }
    $scope.schools = schools;
  });

  $scope.cfaConfig = _.merge({
    options: {title: {text: 'Enrolled in Child First Authority'}},
    func: function(chart) {
      $scope.cfaChartObj = chart;
    }
  }, defaultChartConfig);


  $scope.nonConfig = _.merge({
    options: {title: {text: 'Not Enrolled in Child First Authority'}},
    func: function(chart) {
      $scope.nonChartObj = chart;
    }
  }, defaultChartConfig);

  $scope.$watch('selected.school', function(n, o) {
    if (n !== o) {
      delete $scope.loaded;
      Visualization.get({controller: 'cfa-comparison'}, n, function(data) {
        $scope.cfaConfig.series = dataToSeries('Enrolled', data.cfa);
        $scope.nonConfig.series = dataToSeries('Not Enrolled', data.non);
        $scope.loaded = true;
        $timeout(function() {
          if ($scope.loaded) {
            $scope.cfaChartObj.reflow();
            $scope.nonChartObj.reflow();
          }
        });
      }, function(err) {
        console.log(err);
      });
    }
  });
  // Timeout used to redraw the chart after animation delay of resizing the
  // sidebar.
  $scope.$watch('sidebar.expanded', function() {
    $timeout(function() {
      if ($scope.loaded) {
        $scope.cfaChartObj.reflow();
        $scope.nonChartObj.reflow();
      }
    }, 510);
  });
}

defaultChartConfig = {
  options: {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    tooltip: {
      pointFormat: '{series.name}<br>' +
                   '<b>{point.percentage:.1f}%</b><br>' +
                   '<em>{point.y} total</em>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          color: 'black',
          distance: -35,
          useHTML: true,
          formatter: function() {
            if (this.y) {
              return this.y + ' <i class="fa fa-child"></i><br/>' +
                     '(' + Math.round(this.percentage * 10) / 10 + '%)';
            }
            return null;
          }
        },
        showInLegend: true
      },
      series: {
        animation: false
      }
    }
  }
};

categorySettings = {
  'Normal': {legendIndex: 0, color: '#a5c261'},
  'ARCA': {legendIndex: 1, color: '#ffc66d'},
  'CA': {legendIndex: 2, color: '#da4939'}
};

dataToSeries = function(name, data) {
  var series = [{
    name: name,
    colorByPoint: true,
    data: []
  }];
  if (data) {
    series[0].data = _(data)
      .toPairs()
      .map(function(item) {
        item.push(categorySettings[item[0]].legendIndex);
        item.push(categorySettings[item[0]].color);
        return _.zipObject(['name', 'y', 'legendIndex', 'color'], item);
      })
      .value();
  }
  return series;
};

angular.module('app').controller('VisualizationCtrl', VisualizationCtrl);
