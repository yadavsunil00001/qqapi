'use strict';

var app = require('../..');
import request from 'supertest';

var newAuthorise;

describe('Authorise API:', function () {

  describe('GET /api/authorise', function () {
    var authorises;

    beforeEach(function (done) {
      request(app)
        .get('/api/authorise')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          authorises = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      authorises.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/authorise', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/authorise')
        .send({
          name: 'New Authorise',
          info: 'This is the brand new authorise!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAuthorise = res.body;
          done();
        });
    });

    it('should respond with the newly created authorise', function () {
      newAuthorise.name.should.equal('New Authorise');
      newAuthorise.info.should.equal('This is the brand new authorise!!!');
    });

  });

  describe('GET /api/authorise/:id', function () {
    var authorise;

    beforeEach(function (done) {
      request(app)
        .get('/api/authorise/' + newAuthorise._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          authorise = res.body;
          done();
        });
    });

    afterEach(function () {
      authorise = {};
    });

    it('should respond with the requested authorise', function () {
      authorise.name.should.equal('New Authorise');
      authorise.info.should.equal('This is the brand new authorise!!!');
    });

  });

  describe('PUT /api/authorise/:id', function () {
    var updatedAuthorise;

    beforeEach(function (done) {
      request(app)
        .put('/api/authorise/' + newAuthorise._id)
        .send({
          name: 'Updated Authorise',
          info: 'This is the updated authorise!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedAuthorise = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedAuthorise = {};
    });

    it('should respond with the updated authorise', function () {
      updatedAuthorise.name.should.equal('Updated Authorise');
      updatedAuthorise.info.should.equal('This is the updated authorise!!!');
    });

  });

  describe('DELETE /api/authorise/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/authorise/' + newAuthorise._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when authorise does not exist', function (done) {
      request(app)
        .delete('/api/authorise/' + newAuthorise._id)
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
