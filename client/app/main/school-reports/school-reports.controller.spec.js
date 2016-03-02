'use strict';

describe('Controller: SchoolReports', function() {

  // load the controller's module
  beforeEach(module('app'));

  var SchoolReports, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    SchoolReports = $controller('SchoolReports', {
      $scope: scope
    });
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
