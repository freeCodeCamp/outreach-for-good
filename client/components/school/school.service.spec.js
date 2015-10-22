'use strict';

describe('Service: School', function() {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var School;
  beforeEach(inject(function(_School_) {
    School = _School_;
  }));

  it('should do something', function() {
    expect(!!School).toBe(true);
  });

});
