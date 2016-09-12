'use strict';

var should = require('should');
var app = require('../../app');
var User = require('./user.model');

describe('User Model', function() {
  var user = new User({
    provider: 'local',
    name: 'Fake User',
    email: 'test@test.com'
  });

  before(function(done) {
    // Clear users before testing
    User.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should successfully save user', function(done) {
    user.save(function(err, saved) {
      saved.should.have.property('name', 'Fake User');
      saved.should.have.property('email', 'test@test.com');
      saved.should.have.property('_id');
      done();
    });
  });
});
