'use strict';

describe('Service: Intervention', function() {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var Intervention;
  beforeEach(inject(function(_Intervention_) {
    Intervention = _Intervention_;
  }));

  it('should do something', function() {
    expect(!!Intervention).toBe(true);
  });

});
