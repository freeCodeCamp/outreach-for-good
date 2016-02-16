'use strict';

// http://brianhann.com/ui-grid-and-dropdowns/
function uiSelectWrap($document, uiGridEditConstants) {
  return function link($scope) {
    $document.on('click', function docClick(evt) {
      if ($(evt.target).closest('.ui-select-container').size() === 0) {
        $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
        $document.off('click', docClick);
      }
    });
  };
}

angular.module('app').directive('uiSelectWrap', uiSelectWrap);
