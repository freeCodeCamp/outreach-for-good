'use strict';

describe('Controller: PDFUploadCtrl', function() {

  // load the controller's module
  beforeEach(module('app'));

  var PDFUploadCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    PDFUploadCtrl = $controller('PDFUploadCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
