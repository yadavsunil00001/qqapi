'use strict';

var app = require('../..');
import request from 'supertest';

var newDegree;

describe('Degree API:', function () {

  describe('GET /api/degrees', function () {
    var degrees;

    beforeEach(function (done) {
      request(app)
        .get('/api/degrees')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          degrees = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      degrees.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/degrees', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/degrees')
        .send({
          name: 'New Degree',
          info: 'This is the brand new degree!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDegree = res.body;
          done();
        });
    });

    it('should respond with the newly created degree', function () {
      newDegree.name.should.equal('New Degree');
      newDegree.info.should.equal('This is the brand new degree!!!');
    });

  });

  describe('GET /api/degrees/:id', function () {
    var degree;

    beforeEach(function (done) {
      request(app)
        .get('/api/degrees/' + newDegree._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          degree = res.body;
          done();
        });
    });

    afterEach(function () {
      degree = {};
    });

    it('should respond with the requested degree', function () {
      degree.name.should.equal('New Degree');
      degree.info.should.equal('This is the brand new degree!!!');
    });

  });

  describe('PUT /api/degrees/:id', function () {
    var updatedDegree;

    beforeEach(function (done) {
      request(app)
        .put('/api/degrees/' + newDegree._id)
        .send({
          name: 'Updated Degree',
          info: 'This is the updated degree!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedDegree = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedDegree = {};
    });

    it('should respond with the updated degree', function () {
      updatedDegree.name.should.equal('Updated Degree');
      updatedDegree.info.should.equal('This is the updated degree!!!');
    });

  });

  describe('DELETE /api/degrees/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/degrees/' + newDegree._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when degree does not exist', function (done) {
      request(app)
        .delete('/api/degrees/' + newDegree._id)
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
