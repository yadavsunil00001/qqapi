'use strict';

var app = require('../..');
import request from 'supertest';

var newJobsEmployer;

describe('JobsEmployer API:', function () {

  describe('GET /api/jobsEmployers', function () {
    var jobsEmployers;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobsEmployers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobsEmployers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      jobsEmployers.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobsEmployers', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/jobsEmployers')
        .send({
          name: 'New JobsEmployer',
          info: 'This is the brand new jobsEmployer!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobsEmployer = res.body;
          done();
        });
    });

    it('should respond with the newly created jobsEmployer', function () {
      newJobsEmployer.name.should.equal('New JobsEmployer');
      newJobsEmployer.info.should.equal('This is the brand new jobsEmployer!!!');
    });

  });

  describe('GET /api/jobsEmployers/:id', function () {
    var jobsEmployer;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobsEmployers/' + newJobsEmployer._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobsEmployer = res.body;
          done();
        });
    });

    afterEach(function () {
      jobsEmployer = {};
    });

    it('should respond with the requested jobsEmployer', function () {
      jobsEmployer.name.should.equal('New JobsEmployer');
      jobsEmployer.info.should.equal('This is the brand new jobsEmployer!!!');
    });

  });

  describe('PUT /api/jobsEmployers/:id', function () {
    var updatedJobsEmployer;

    beforeEach(function (done) {
      request(app)
        .put('/api/jobsEmployers/' + newJobsEmployer._id)
        .send({
          name: 'Updated JobsEmployer',
          info: 'This is the updated jobsEmployer!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedJobsEmployer = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedJobsEmployer = {};
    });

    it('should respond with the updated jobsEmployer', function () {
      updatedJobsEmployer.name.should.equal('Updated JobsEmployer');
      updatedJobsEmployer.info.should.equal('This is the updated jobsEmployer!!!');
    });

  });

  describe('DELETE /api/jobsEmployers/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/jobsEmployers/' + newJobsEmployer._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobsEmployer does not exist', function (done) {
      request(app)
        .delete('/api/jobsEmployers/' + newJobsEmployer._id)
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
