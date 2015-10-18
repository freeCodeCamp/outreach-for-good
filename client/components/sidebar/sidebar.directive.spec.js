'use strict';

describe('Directive: sidebar', function() {

  // load the directive's module and view
  beforeEach(module('app'));
  // Defer intercept to prevent ui router from breaking karma test.
  // https://github.com/angular-ui/ui-router/issues/212
  beforeEach(module(function($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));
  beforeEach(module('components/sidebar/sidebar.html'));

  var element, scope;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    element = angular.element('<sidebar></sidebar>');
    element = $compile(element)(scope);
    scope.$apply();
  }));

  it('should create a sidbar with an isolated scope', function() {
    var isolated = element.isolateScope();
    expect(isolated.sidebar.isCollapsed).toBe(true);
  });
});
