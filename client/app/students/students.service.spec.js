'use strict';

describe('Service: students', function () {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var Students;
  beforeEach(inject(function (_Students_) {
    Students = _Students_;
  }));

  it('should do something', function () {
    expect(!!Students).toBe(true);
  });

});
