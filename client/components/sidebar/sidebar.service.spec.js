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

  it('should be created with isCollapsed true', function() {
    console.log(sidebar);
    expect(sidebar.isCollapsed()).toBe(true);
  });

  it('should toggle isCollapsed when toggle() is called', function() {
    expect(sidebar.isCollapsed()).toBe(true);
    sidebar.toggle();
    expect(sidebar.isCollapsed()).toBe(false);
  });
});
