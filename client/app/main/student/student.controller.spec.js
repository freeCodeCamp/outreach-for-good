'use strict';

describe('Controller: StudentCtrl', function() {

  // load the controller's module
  beforeEach(module('app'));

  var StudentCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    StudentCtrl = $controller('StudentCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
