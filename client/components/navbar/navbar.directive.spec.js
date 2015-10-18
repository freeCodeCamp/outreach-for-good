'use strict';

describe('Directive: navbar', function() {

  // load the directive's module and view
  beforeEach(module('app'));
  // Defer intercept to prevent ui router from breaking karma test.
  // https://github.com/angular-ui/ui-router/issues/212
  beforeEach(module(function($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));
  beforeEach(module('components/navbar/navbar.html'));

  var element, scope;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    element = angular.element('<navbar></navbar>');
    element = $compile(element)(scope);
    scope.$apply();
  }));

  it('should create a navbar with an isolated scope', inject(function() {
    var isolated = element.isolateScope();
    expect(isolated.isCollapsed).toBe(true);
  }));
});
