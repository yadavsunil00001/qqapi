'use strict';

var app = require('../..');
import request from 'supertest';

var newLogin;

describe('Login API:', function() {

  describe('GET /api/login', function() {
    var logins;

    beforeEach(function(done) {
      request(app)
        .get('/api/login')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          logins = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      logins.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/login', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/login')
        .send({
          name: 'New Login',
          info: 'This is the brand new login!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newLogin = res.body;
          done();
        });
    });

    it('should respond with the newly created login', function() {
      newLogin.name.should.equal('New Login');
      newLogin.info.should.equal('This is the brand new login!!!');
    });

  });

  describe('GET /api/login/:id', function() {
    var login;

    beforeEach(function(done) {
      request(app)
        .get('/api/login/' + newLogin._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          login = res.body;
          done();
        });
    });

    afterEach(function() {
      login = {};
    });

    it('should respond with the requested login', function() {
      login.name.should.equal('New Login');
      login.info.should.equal('This is the brand new login!!!');
    });

  });

  describe('PUT /api/login/:id', function() {
    var updatedLogin;

    beforeEach(function(done) {
      request(app)
        .put('/api/login/' + newLogin._id)
        .send({
          name: 'Updated Login',
          info: 'This is the updated login!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedLogin = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLogin = {};
    });

    it('should respond with the updated login', function() {
      updatedLogin.name.should.equal('Updated Login');
      updatedLogin.info.should.equal('This is the updated login!!!');
    });

  });

  describe('DELETE /api/login/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/login/' + newLogin._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when login does not exist', function(done) {
      request(app)
        .delete('/api/login/' + newLogin._id)
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
