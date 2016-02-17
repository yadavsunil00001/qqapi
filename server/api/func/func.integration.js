'use strict';

var app = require('../..');
import request from 'supertest';

var newFunc;

describe('Func API:', function() {

  describe('GET /api/funcs', function() {
    var funcs;

    beforeEach(function(done) {
      request(app)
        .get('/api/funcs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          funcs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      funcs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/funcs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/funcs')
        .send({
          name: 'New Func',
          info: 'This is the brand new func!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newFunc = res.body;
          done();
        });
    });

    it('should respond with the newly created func', function() {
      newFunc.name.should.equal('New Func');
      newFunc.info.should.equal('This is the brand new func!!!');
    });

  });

  describe('GET /api/funcs/:id', function() {
    var func;

    beforeEach(function(done) {
      request(app)
        .get('/api/funcs/' + newFunc._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          func = res.body;
          done();
        });
    });

    afterEach(function() {
      func = {};
    });

    it('should respond with the requested func', function() {
      func.name.should.equal('New Func');
      func.info.should.equal('This is the brand new func!!!');
    });

  });

  describe('PUT /api/funcs/:id', function() {
    var updatedFunc;

    beforeEach(function(done) {
      request(app)
        .put('/api/funcs/' + newFunc._id)
        .send({
          name: 'Updated Func',
          info: 'This is the updated func!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedFunc = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFunc = {};
    });

    it('should respond with the updated func', function() {
      updatedFunc.name.should.equal('Updated Func');
      updatedFunc.info.should.equal('This is the updated func!!!');
    });

  });

  describe('DELETE /api/funcs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/funcs/' + newFunc._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when func does not exist', function(done) {
      request(app)
        .delete('/api/funcs/' + newFunc._id)
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
