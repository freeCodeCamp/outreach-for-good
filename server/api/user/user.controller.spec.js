'use strict';

var should = require('should');
var app = require('../../app');
var auth = require('../../auth/auth.service');
var User = require('./user.model');
var request = require('supertest');

describe('User controller', function() {
  var userObjects = [
    {email: 'guest@example.com', role: 'guest'},
    {email: 'teacher@example.com', role: 'teacher'},
    {email: 'manager@example.com', role: 'manager'},
    {email: 'admin1@example.com', role: 'admin'},
    {email: 'admin2@example.com', role: 'admin'},
    {email: 'super1@example.com', role: 'super'},
    {email: 'super2@example.com', role: 'super'}
  ];

  before(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  describe('index', function() {
    var users;

    before(function(done) {
      users = {};
      seedDb(userObjects, users, done);
    });

    after(function(done) {
      User.remove().exec().then(function() {
        done();
      });
    });

    it('should res forbidden for guest users.', function(done) {
      var token = auth.signToken(users.guest._id);
      request(app).get('/api/users/')
        .query({access_token: token})
        .expect(403, done);
    });

    it('should res forbidden for teacher users.', function(done) {
      var token = auth.signToken(users.teacher._id);
      request(app).get('/api/users/')
        .query({access_token: token})
        .expect(403, done);
    });

    it('should res forbidden for manager users.', function(done) {
      var token = auth.signToken(users.manager._id);
      request(app).get('/api/users/')
        .query({access_token: token})
        .expect(403, done);
    });

    it('should return list of all users for admin users.', function(done) {
      var token = auth.signToken(users.admin1._id);
      request(app).get('/api/users/')
        .query({access_token: token})
        .expect(200)
        .expect(function(res) {
          res.body.should.have.length(userObjects.length);
        })
        .end(done);
    });

    it('should return list of all users for super users.', function(done) {
      var token = auth.signToken(users.super1._id);
      request(app).get('/api/users/')
        .query({access_token: token})
        .expect(200)
        .expect(function(res) {
          res.body.should.have.length(userObjects.length);
        })
        .end(done);
    });
  });

  describe('delete', function() {
    var users;

    beforeEach(function(done) {
      users = {};
      seedDb(userObjects, users, done);
    });

    afterEach(function(done) {
      User.remove().exec().then(function() {
        done();
      });
    });

    it('should res forbidden for guest users.', function(done) {
      var token = auth.signToken(users.guest._id);
      request(app).delete('/api/users/' + users.guest._id)
        .query({access_token: token})
        .expect(403, done);
    });

    it('should res forbidden for teacher users.', function(done) {
      var token = auth.signToken(users.teacher._id);
      request(app).delete('/api/users/' + users.guest._id)
        .query({access_token: token})
        .expect(403, done);
    });

    it('should res forbidden for manager users.', function(done) {
      var token = auth.signToken(users.manager._id);
      request(app).delete('/api/users/' + users.guest._id)
        .query({access_token: token})
        .expect(403, done);
    });

    it('should res forbidden for delete super user by admin.', function(done) {
      var token = auth.signToken(users.admin1._id);
      request(app).delete('/api/users/' + users.super1._id)
        .query({access_token: token})
        .expect(403, done);
    });

    it('should res 204 for delete admin user by admin.', function(done) {
      var token = auth.signToken(users.admin1._id);
      request(app).delete('/api/users/' + users.admin2._id)
        .query({access_token: token})
        .expect(204)
        .end(function() {
          request(app).get('/api/users/' + users.admin2._id)
            .query({access_token: token})
            .expect(401, done);
        });
    });

    it('should res 204 for delete admin user by super.', function(done) {
      var token = auth.signToken(users.super1._id);
      request(app).delete('/api/users/' + users.admin1._id)
        .query({access_token: token})
        .expect(204)
        .end(function() {
          request(app).get('/api/users/' + users.admin1._id)
            .query({access_token: token})
            .expect(401, done);
        });
    });

    it('should res 204 for delete super user by super.', function(done) {
      var token = auth.signToken(users.super1._id);
      request(app).delete('/api/users/' + users.super2._id)
        .query({access_token: token})
        .expect(204)
        .end(function() {
          request(app).get('/api/users/' + users.super2._id)
            .query({access_token: token})
            .expect(401, done);
        });
    });
  });

  describe('updateRole', function() {
    var users;

    beforeEach(function(done) {
      users = {};
      seedDb(userObjects, users, done);
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

      it('should be forbidden for changing user role to super.',
        function(done) {
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
});

function seedDb(userObjects, users, done) {
  User.create(userObjects)
    .then(function(userArr) {
      userArr.forEach(function(user) {
        users[user.email.split('@')[0]] = user;
      });
    })
    .then(function() {
      done();
    });
}
