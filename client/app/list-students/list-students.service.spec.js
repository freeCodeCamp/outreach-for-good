'use strict';

describe('Service: listStudents', function () {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var listStudents;
  beforeEach(inject(function (_listStudents_) {
    listStudents = _listStudents_;
  }));

  it('should do something', function () {
    expect(!!listStudents).toBe(true);
  });

});
