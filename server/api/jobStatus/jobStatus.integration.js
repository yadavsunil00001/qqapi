'use strict';

var app = require('../..');
import request from 'supertest';

var newJobStatus;

describe('JobStatus API:', function () {

  describe('GET /api/jobStatus', function () {
    var jobStatuss;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobStatus')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobStatuss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      jobStatuss.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobStatus', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/jobStatus')
        .send({
          name: 'New JobStatus',
          info: 'This is the brand new jobStatus!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobStatus = res.body;
          done();
        });
    });

    it('should respond with the newly created jobStatus', function () {
      newJobStatus.name.should.equal('New JobStatus');
      newJobStatus.info.should.equal('This is the brand new jobStatus!!!');
    });

  });

  describe('GET /api/jobStatus/:id', function () {
    var jobStatus;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobStatus/' + newJobStatus._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobStatus = res.body;
          done();
        });
    });

    afterEach(function () {
      jobStatus = {};
    });

    it('should respond with the requested jobStatus', function () {
      jobStatus.name.should.equal('New JobStatus');
      jobStatus.info.should.equal('This is the brand new jobStatus!!!');
    });

  });

  describe('PUT /api/jobStatus/:id', function () {
    var updatedJobStatus;

    beforeEach(function (done) {
      request(app)
        .put('/api/jobStatus/' + newJobStatus._id)
        .send({
          name: 'Updated JobStatus',
          info: 'This is the updated jobStatus!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedJobStatus = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedJobStatus = {};
    });

    it('should respond with the updated jobStatus', function () {
      updatedJobStatus.name.should.equal('Updated JobStatus');
      updatedJobStatus.info.should.equal('This is the updated jobStatus!!!');
    });

  });

  describe('DELETE /api/jobStatus/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/jobStatus/' + newJobStatus._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobStatus does not exist', function (done) {
      request(app)
        .delete('/api/jobStatus/' + newJobStatus._id)
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
