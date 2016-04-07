'use strict';

function VisualizationCtrl($scope, $timeout, Sidebar, Visualization) {
  $scope.sidebar = Sidebar;
  $scope.chartConfig = {
    options: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'ARCA and CA in CFA vs ARCA and CA not in CFA'
      },
      // tooltip: {
      //   pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      // }
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: false
          },
          showInLegend: true
        }
      }
    }
  };

  Visualization.arcaCa().$promise.then(function(results) {
    var pctObj = { 
      cfa: { arca: 0, ca: 0, other: 0 }, 
      nonCfa: { arca: 0, ca: 0, other: 0 } 
    };
    function counter(rec, isCfa) {
      var key = isCfa ? 'cfa' : 'nonCfa';
      if(rec.arca) { 
        pctObj[key].arca++; 
      } else if(rec.ca) { 
        pctObj[key].ca++; 
      } else { 
        pctObj[key].other++; 
      }
    }
    function getPct(obj, isCfa) {
      var k = (isCfa === 'cfa') ? 'cfa' : 'nonCfa';
      var tot = pctObj[k].arca + pctObj[k].ca + pctObj[k].other;
      if(tot) {
        pctObj[k].arca = parseInt(((pctObj[k].arca / tot) * 100).toFixed(2), 10);
        pctObj[k].ca = parseInt(((pctObj[k].ca / tot) * 100).toFixed(2), 10);
        pctObj[k].other = parseInt(((pctObj[k].other / tot) * 100).toFixed(2), 10);
      } else {
        // If tot = 0 or is undefined
        pctObj[k].arca = 0;
        pctObj[k].ca = 0;
        pctObj[k].other = 0;
      }
    }
    _.forEach(results, function(record) {
      if(record.student.cfa) { 
        counter(record, true);
      } else {
        counter(record, false);
      }
    });
    _.forEach(pctObj, function(val, key) {
      getPct(val, key);
    });

    console.log('pctObj::final', pctObj);


    $scope.chartConfig.series = [{
      name: 'Non CFA Students',
      colorByPoint: true,
      data: [{
        name: 'ARCA',
        y: pctObj.nonCfa.arca
      },{
        name: 'CA',
        y: pctObj.nonCfa.ca
      }, {
        name: 'Other',
        y: pctObj.nonCfa.other
      }]
    }, {
      name: 'CFA Students',
      colorByPoint: true,
      data: [{
        name: 'ARCA',
        y: pctObj.cfa.arca
      }, {
        name: 'CA',
        y: pctObj.cfa.ca          
      }, {
        name: 'Other',
        y: pctObj.cfa.other
      }]
    }];
  });
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
