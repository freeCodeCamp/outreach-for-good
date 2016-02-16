'use strict';

describe('Service: Outreach', function() {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var Outreach;
  beforeEach(inject(function(_Outreach_) {
    Outreach = _Outreach_;
  }));

  it('should do something', function() {
    expect(!!Outreach).toBe(true);
  });

});
