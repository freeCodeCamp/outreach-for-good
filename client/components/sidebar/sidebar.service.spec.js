'use strict';

describe('Service: SidebarService', function() {

  // load the service's module
  beforeEach(module('app'));
  // Defer intercept to prevent ui router from breaking karma test.
  // https://github.com/angular-ui/ui-router/issues/212
  beforeEach(module(function($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));

  // instantiate service
  var sidebar;
  beforeEach(inject(function(_Sidebar_) {
    sidebar = _Sidebar_;
  }));

  it('should be created with expanded false', function() {
    expect(sidebar.expanded).toBe(false);
  });

  it('should toggle expanded when toggle() is called', function() {
    expect(sidebar.expanded).toBe(false);
    sidebar.toggle();
    expect(sidebar.expanded).toBe(true);
  });
});
