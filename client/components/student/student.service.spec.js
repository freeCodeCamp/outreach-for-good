'use strict';

describe('Service: Student', function () {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var Student;
  beforeEach(inject(function (_Student_) {
    Student = _Student_;
  }));

  it('should do something', function () {
    expect(!!Student).toBe(true);
  });

});
