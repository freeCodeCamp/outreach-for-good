'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/interventions', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/interventions')
      .expect(401, done);
  });
});
