'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/students', function() {
  it('should return unauthorized response', function(done) {
    request(app)
      .get('/api/schools')
      .expect(401, done);
  });
});
