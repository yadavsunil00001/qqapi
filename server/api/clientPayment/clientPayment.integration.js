'use strict';

var app = require('../..');
import request from 'supertest';

var newClientPayment;

describe('ClientPayment API:', function() {

  describe('GET /api/clientPayments', function() {
    var clientPayments;

    beforeEach(function(done) {
      request(app)
        .get('/api/clientPayments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          clientPayments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      clientPayments.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/clientPayments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/clientPayments')
        .send({
          name: 'New ClientPayment',
          info: 'This is the brand new clientPayment!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newClientPayment = res.body;
          done();
        });
    });

    it('should respond with the newly created clientPayment', function() {
      newClientPayment.name.should.equal('New ClientPayment');
      newClientPayment.info.should.equal('This is the brand new clientPayment!!!');
    });

  });

  describe('GET /api/clientPayments/:id', function() {
    var clientPayment;

    beforeEach(function(done) {
      request(app)
        .get('/api/clientPayments/' + newClientPayment._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          clientPayment = res.body;
          done();
        });
    });

    afterEach(function() {
      clientPayment = {};
    });

    it('should respond with the requested clientPayment', function() {
      clientPayment.name.should.equal('New ClientPayment');
      clientPayment.info.should.equal('This is the brand new clientPayment!!!');
    });

  });

  describe('PUT /api/clientPayments/:id', function() {
    var updatedClientPayment;

    beforeEach(function(done) {
      request(app)
        .put('/api/clientPayments/' + newClientPayment._id)
        .send({
          name: 'Updated ClientPayment',
          info: 'This is the updated clientPayment!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedClientPayment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedClientPayment = {};
    });

    it('should respond with the updated clientPayment', function() {
      updatedClientPayment.name.should.equal('Updated ClientPayment');
      updatedClientPayment.info.should.equal('This is the updated clientPayment!!!');
    });

  });

  describe('DELETE /api/clientPayments/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/clientPayments/' + newClientPayment._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when clientPayment does not exist', function(done) {
      request(app)
        .delete('/api/clientPayments/' + newClientPayment._id)
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
