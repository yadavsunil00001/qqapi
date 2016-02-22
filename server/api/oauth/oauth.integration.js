'use strict';

var app = require('../..');
import request from 'supertest';

var newOauth;

describe('Oauth API:', function() {

  describe('GET /api/oauth', function() {
    var oauths;

    beforeEach(function(done) {
      request(app)
        .get('/api/oauth')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          oauths = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      oauths.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/oauth', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/oauth')
        .send({
          name: 'New Oauth',
          info: 'This is the brand new oauth!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newOauth = res.body;
          done();
        });
    });

    it('should respond with the newly created oauth', function() {
      newOauth.name.should.equal('New Oauth');
      newOauth.info.should.equal('This is the brand new oauth!!!');
    });

  });

  describe('GET /api/oauth/:id', function() {
    var oauth;

    beforeEach(function(done) {
      request(app)
        .get('/api/oauth/' + newOauth._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          oauth = res.body;
          done();
        });
    });

    afterEach(function() {
      oauth = {};
    });

    it('should respond with the requested oauth', function() {
      oauth.name.should.equal('New Oauth');
      oauth.info.should.equal('This is the brand new oauth!!!');
    });

  });

  describe('PUT /api/oauth/:id', function() {
    var updatedOauth;

    beforeEach(function(done) {
      request(app)
        .put('/api/oauth/' + newOauth._id)
        .send({
          name: 'Updated Oauth',
          info: 'This is the updated oauth!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedOauth = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOauth = {};
    });

    it('should respond with the updated oauth', function() {
      updatedOauth.name.should.equal('Updated Oauth');
      updatedOauth.info.should.equal('This is the updated oauth!!!');
    });

  });

  describe('DELETE /api/oauth/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/oauth/' + newOauth._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when oauth does not exist', function(done) {
      request(app)
        .delete('/api/oauth/' + newOauth._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
