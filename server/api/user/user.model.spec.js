'use strict';

var _ = require('lodash');
var should = require('should');
var app = require('../../app');
var auth = require('../../auth/auth.service');
var User = require('./user.model');
var request = require('supertest');

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

  it('should fail when saving a duplicate user', function(done) {
    user.save(function() {
      var userDup = new User(user);
      userDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });
});

describe('Update Role', function() {
  var guest = {email: 'guest@example.com', role: 'guest'};
  var teacher = {email: 'teacher@example.com', role: 'teacher'};
  var manager = {email: 'manager@example.com', role: 'manager'};
  var admin1 = {email: 'admin1@example.com', role: 'admin'};
  var admin2 = {email: 'admin2@example.com', role: 'admin'};
  var super1 = {email: 'super1@example.com', role: 'super'};
  var super2 = {email: 'super2@example.com', role: 'super'};
  var users = {};

  beforeEach(function(done) {
    // Recreate users before testing
    User.remove().exec().then(function() {
      User.create(guest, teacher, manager, admin1, admin2, super1, super2,
        function() {
          for (var i = 1; i < arguments.length; i++) {
            var name = arguments[i].email.split('@')[0];
            users[name] = arguments[i];
          }
          done();
        });
    });
  });

  afterEach(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  describe('by guest user', function() {
    it('should be forbidden.', function(done) {
      var token = auth.signToken(users.guest._id);
      request(app).put('/api/users/' + users.guest._id + '/role')
        .query({access_token: token})
        .send({role: 'guest'})
        .expect(403, done);
    });
  });

  describe('by teacher user', function() {
    it('should be forbidden.', function(done) {
      var token = auth.signToken(users.teacher._id);
      request(app).put('/api/users/' + users.guest._id + '/role')
        .query({access_token: token})
        .send({role: 'guest'})
        .expect(403, done);
    });
  });

  describe('by manager user', function() {
    it('should be forbidden.', function(done) {
      var token = auth.signToken(users.manager._id);
      request(app).put('/api/users/' + users.guest._id + '/role')
        .query({access_token: token})
        .send({role: 'guest'})
        .expect(403, done);
    });
  });

  describe('by admin user', function() {
    it('should be valid when setting guest user to admin.', function(done) {
      var token = auth.signToken(users.admin1._id);
      request(app).put('/api/users/' + users.guest._id + '/role')
        .query({access_token: token})
        .send({role: 'admin'})
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.email.should.be.equal(users.guest.email);
          res.body.role.should.be.equal('admin');
          done();
        });
    });

    it('should be valid when setting admin user to guest.', function(done) {
      var token = auth.signToken(users.admin1._id);
      request(app).put('/api/users/' + users.admin2._id + '/role')
        .query({access_token: token})
        .send({role: 'guest'})
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.email.should.be.equal(users.admin2.email);
          res.body.role.should.be.equal('guest');
          done();
        });
    });

    it('should be forbidden for changing user role to super.', function(done) {
      var token = auth.signToken(users.admin1._id);
      request(app).put('/api/users/' + users.admin2._id + '/role')
        .query({access_token: token})
        .send({role: 'super'})
        .expect(403, done);
    });

    it('should be forbidden for changing super user role.', function(done) {
      var token = auth.signToken(users.admin1._id);
      request(app).put('/api/users/' + users.super1._id + '/role')
        .query({access_token: token})
        .send({role: 'admin'})
        .expect(403, done);
    });
  });

  describe('by super user', function() {
    it('should be valid when setting admin user to super.', function(done) {
      var token = auth.signToken(users.super1._id);
      request(app).put('/api/users/' + users.admin1._id + '/role')
        .query({access_token: token})
        .send({role: 'super'})
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.email.should.be.equal(users.admin1.email);
          res.body.role.should.be.equal('super');
          done();
        });
    });

    it('should be valid when setting super user to guest.', function(done) {
      var token = auth.signToken(users.super1._id);
      request(app).put('/api/users/' + users.super2._id + '/role')
        .query({access_token: token})
        .send({role: 'guest'})
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.email.should.be.equal(users.super2.email);
          res.body.role.should.be.equal('guest');
          done();
        });
    });
  });
});
