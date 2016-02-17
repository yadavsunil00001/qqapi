'use strict';

var app = require('../..');
import request from 'supertest';

var newLogo;

describe('Logo API:', function() {

  describe('GET /api/logos', function() {
    var logos;

    beforeEach(function(done) {
      request(app)
        .get('/api/logos')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          logos = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      logos.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/logos', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/logos')
        .send({
          name: 'New Logo',
          info: 'This is the brand new logo!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newLogo = res.body;
          done();
        });
    });

    it('should respond with the newly created logo', function() {
      newLogo.name.should.equal('New Logo');
      newLogo.info.should.equal('This is the brand new logo!!!');
    });

  });

  describe('GET /api/logos/:id', function() {
    var logo;

    beforeEach(function(done) {
      request(app)
        .get('/api/logos/' + newLogo._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          logo = res.body;
          done();
        });
    });

    afterEach(function() {
      logo = {};
    });

    it('should respond with the requested logo', function() {
      logo.name.should.equal('New Logo');
      logo.info.should.equal('This is the brand new logo!!!');
    });

  });

  describe('PUT /api/logos/:id', function() {
    var updatedLogo;

    beforeEach(function(done) {
      request(app)
        .put('/api/logos/' + newLogo._id)
        .send({
          name: 'Updated Logo',
          info: 'This is the updated logo!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedLogo = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLogo = {};
    });

    it('should respond with the updated logo', function() {
      updatedLogo.name.should.equal('Updated Logo');
      updatedLogo.info.should.equal('This is the updated logo!!!');
    });

  });

  describe('DELETE /api/logos/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/logos/' + newLogo._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when logo does not exist', function(done) {
      request(app)
        .delete('/api/logos/' + newLogo._id)
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
