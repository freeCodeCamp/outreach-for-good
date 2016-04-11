'use strict';

function SchoolReportsMenu($timeout) {
  var menuItems = [];

  function setItems(arr) {
    menuItems.length = 0;
    if (arr.length) {
      [].push.apply(menuItems, arr);
    }
  }

  function defaultItems(scope) {
    setItems([{
      text: 'Withdrawn Students',
      action: function() {
        scope.showWithdrawn = !scope.showWithdrawn;
        var defs = scope.gridOptions.columnDefs;
        _.find(defs, {displayName: 'Withdrawn'}).visible = scope.showWithdrawn;
        scope.gridApi.grid.refresh();
        $timeout(scope.gridApi.treeBase.expandAllRows);
      },
      iconFn: function() {
        return scope.showWithdrawn ?
               'fa-check-square-o text-success' : 'fa-square-o';
      }
    }]);
  }

  function outreachSummaryItems(scope) {
    defaultItems(scope);
    [].push.apply(menuItems, [{
      separator: true,
      text: 'Resolved',
      action: function() {
        scope.showResolved = !scope.showResolved;
        var defs = scope.gridOptions.columnDefs;
        _.filter(defs, {displayName: 'Resolved'}).forEach(function(def) {
          def.visible = scope.showResolved;
        });
        scope.gridApi.grid.refresh();
      },
      iconFn: function() {
        return scope.showResolved ?
               'fa-check-square-o text-success' : 'fa-square-o';
      }
    }, {
      text: 'Outstanding',
      action: function() {
        scope.showOutstanding = !scope.showOutstanding;
        var defs = scope.gridOptions.columnDefs;
        _.filter(defs, {displayName: 'Outstanding'}).forEach(function(def) {
          def.visible = scope.showOutstanding;
        });
        scope.gridApi.grid.refresh();
      },
      iconFn: function() {
        return scope.showOutstanding ?
               'fa-check-square-o text-success' : 'fa-square-o';
      }
    }]);
  }

  this.menuItems = menuItems;
  this.setItems = setItems;
  this.defaultItems = defaultItems;
  this.outreachSummaryItems = outreachSummaryItems;
}

angular.module('app').service('SchoolReportsMenu', SchoolReportsMenu);
