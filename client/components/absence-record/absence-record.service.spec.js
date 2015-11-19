'use strict';

describe('Service: AbsenceRecord', function() {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var AbsenceRecord;
  beforeEach(inject(function(_AbsenceRecord_) {
    AbsenceRecord = _AbsenceRecord_;
  }));

  it('should do something', function() {
    expect(!!AbsenceRecord).toBe(true);
  });

});
