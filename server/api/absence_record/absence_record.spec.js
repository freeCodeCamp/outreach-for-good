'use strict';

var should = require('should');
var app = require('../../app');
var AbsenceRecord = require('./absence_record.model');

describe('AbsenceRecord Model', function() {
  var record = new AbsenceRecord({
    schoolYear: '2015-2016',
    school: 'mockSchool'
  });

  before(function(done) {
    // Clear users before testing
    AbsenceRecord.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    AbsenceRecord.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no records', function(done) {
    AbsenceRecord.find({}, function(err, records) {
      records.should.have.length(0);
      done();
    });
  });

  it('should have a created_at virtual field', function(done) {
    record.save(function() {
      should.exist(record.created_at);
      done();
    });
  });

  it('should fail when saving a duplicate user', function(done) {
    record.save(function() {
      var recordDupe = new AbsenceRecord(record);
      recordDupe.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });
});
