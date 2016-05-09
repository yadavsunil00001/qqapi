'use strict';

var app = require('../..');
import request from 'supertest';

var newJobApplication;

describe('JobApplication API:', function () {

  describe('GET /api/jobApplications', function () {
    var jobApplications;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobApplications')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobApplications = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      jobApplications.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobApplications', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/jobApplications')
        .send({
          name: 'New JobApplication',
          info: 'This is the brand new jobApplication!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobApplication = res.body;
          done();
        });
    });

    it('should respond with the newly created jobApplication', function () {
      newJobApplication.name.should.equal('New JobApplication');
      newJobApplication.info.should.equal('This is the brand new jobApplication!!!');
    });

  });

  describe('GET /api/jobApplications/:id', function () {
    var jobApplication;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobApplications/' + newJobApplication._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobApplication = res.body;
          done();
        });
    });

    afterEach(function () {
      jobApplication = {};
    });

    it('should respond with the requested jobApplication', function () {
      jobApplication.name.should.equal('New JobApplication');
      jobApplication.info.should.equal('This is the brand new jobApplication!!!');
    });

  });

  describe('PUT /api/jobApplications/:id', function () {
    var updatedJobApplication;

    beforeEach(function (done) {
      request(app)
        .put('/api/jobApplications/' + newJobApplication._id)
        .send({
          name: 'Updated JobApplication',
          info: 'This is the updated jobApplication!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedJobApplication = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedJobApplication = {};
    });

    it('should respond with the updated jobApplication', function () {
      updatedJobApplication.name.should.equal('Updated JobApplication');
      updatedJobApplication.info.should.equal('This is the updated jobApplication!!!');
    });

  });

  describe('DELETE /api/jobApplications/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/jobApplications/' + newJobApplication._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobApplication does not exist', function (done) {
      request(app)
        .delete('/api/jobApplications/' + newJobApplication._id)
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
