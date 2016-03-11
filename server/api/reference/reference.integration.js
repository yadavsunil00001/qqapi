'use strict';

var app = require('../..');
import request from 'supertest';

var newReference;

describe('Reference API:', function() {

  describe('GET /api/jobs', function() {
    var references;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          references = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      references.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/jobs')
        .send({
          name: 'New Reference',
          info: 'This is the brand new reference!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newReference = res.body;
          done();
        });
    });

    it('should respond with the newly created reference', function() {
      newReference.name.should.equal('New Reference');
      newReference.info.should.equal('This is the brand new reference!!!');
    });

  });

  describe('GET /api/jobs/:id', function() {
    var reference;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobs/' + newReference._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          reference = res.body;
          done();
        });
    });

    afterEach(function() {
      reference = {};
    });

    it('should respond with the requested reference', function() {
      reference.name.should.equal('New Reference');
      reference.info.should.equal('This is the brand new reference!!!');
    });

  });

  describe('PUT /api/jobs/:id', function() {
    var updatedReference;

    beforeEach(function(done) {
      request(app)
        .put('/api/jobs/' + newReference._id)
        .send({
          name: 'Updated Reference',
          info: 'This is the updated reference!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedReference = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedReference = {};
    });

    it('should respond with the updated reference', function() {
      updatedReference.name.should.equal('Updated Reference');
      updatedReference.info.should.equal('This is the updated reference!!!');
    });

  });

  describe('DELETE /api/jobs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/jobs/' + newReference._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when reference does not exist', function(done) {
      request(app)
        .delete('/api/jobs/' + newReference._id)
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
