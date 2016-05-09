'use strict';

var app = require('../..');
import request from 'supertest';

var newJobScore;

describe('JobScore API:', function () {

  describe('GET /api/jobScores', function () {
    var jobScores;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobScores')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobScores = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      jobScores.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobScores', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/jobScores')
        .send({
          name: 'New JobScore',
          info: 'This is the brand new jobScore!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobScore = res.body;
          done();
        });
    });

    it('should respond with the newly created jobScore', function () {
      newJobScore.name.should.equal('New JobScore');
      newJobScore.info.should.equal('This is the brand new jobScore!!!');
    });

  });

  describe('GET /api/jobScores/:id', function () {
    var jobScore;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobScores/' + newJobScore._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobScore = res.body;
          done();
        });
    });

    afterEach(function () {
      jobScore = {};
    });

    it('should respond with the requested jobScore', function () {
      jobScore.name.should.equal('New JobScore');
      jobScore.info.should.equal('This is the brand new jobScore!!!');
    });

  });

  describe('PUT /api/jobScores/:id', function () {
    var updatedJobScore;

    beforeEach(function (done) {
      request(app)
        .put('/api/jobScores/' + newJobScore._id)
        .send({
          name: 'Updated JobScore',
          info: 'This is the updated jobScore!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedJobScore = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedJobScore = {};
    });

    it('should respond with the updated jobScore', function () {
      updatedJobScore.name.should.equal('Updated JobScore');
      updatedJobScore.info.should.equal('This is the updated jobScore!!!');
    });

  });

  describe('DELETE /api/jobScores/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/jobScores/' + newJobScore._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobScore does not exist', function (done) {
      request(app)
        .delete('/api/jobScores/' + newJobScore._id)
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
