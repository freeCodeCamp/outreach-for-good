'use strict';

describe('Service: SidebarService', function() {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var sidebar;
  beforeEach(inject(function(_SidebarService_) {
    sidebar = _SidebarService_;
  }));

  it('should be created with isCollapsed true', function() {
    expect(sidebar.isCollapsed).toBe(true);
  });

  it('should toggle isCollapsed when toggle() is called', function() {
    expect(sidebar.isCollapsed).toBe(true);
    sidebar.toggle();
    expect(sidebar.isCollapsed).toBe(false);
  });
});
