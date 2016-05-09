

var app = require('../..');
import request from 'supertest';

var newJobsInstitute;

describe('JobsInstitute API:', function () {

  describe('GET /api/jobsInstitutes', function () {
    var jobsInstitutes;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobsInstitutes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobsInstitutes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      jobsInstitutes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobsInstitutes', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/jobsInstitutes')
        .send({
          name: 'New JobsInstitute',
          info: 'This is the brand new jobsInstitute!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobsInstitute = res.body;
          done();
        });
    });

    it('should respond with the newly created jobsInstitute', function () {
      newJobsInstitute.name.should.equal('New JobsInstitute');
      newJobsInstitute.info.should.equal('This is the brand new jobsInstitute!!!');
    });

  });

  describe('GET /api/jobsInstitutes/:id', function () {
    var jobsInstitute;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobsInstitutes/' + newJobsInstitute._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobsInstitute = res.body;
          done();
        });
    });

    afterEach(function () {
      jobsInstitute = {};
    });

    it('should respond with the requested jobsInstitute', function () {
      jobsInstitute.name.should.equal('New JobsInstitute');
      jobsInstitute.info.should.equal('This is the brand new jobsInstitute!!!');
    });

  });

  describe('PUT /api/jobsInstitutes/:id', function () {
    var updatedJobsInstitute;

    beforeEach(function (done) {
      request(app)
        .put('/api/jobsInstitutes/' + newJobsInstitute._id)
        .send({
          name: 'Updated JobsInstitute',
          info: 'This is the updated jobsInstitute!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedJobsInstitute = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedJobsInstitute = {};
    });

    it('should respond with the updated jobsInstitute', function () {
      updatedJobsInstitute.name.should.equal('Updated JobsInstitute');
      updatedJobsInstitute.info.should.equal('This is the updated jobsInstitute!!!');
    });

  });

  describe('DELETE /api/jobsInstitutes/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/jobsInstitutes/' + newJobsInstitute._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobsInstitute does not exist', function (done) {
      request(app)
        .delete('/api/jobsInstitutes/' + newJobsInstitute._id)
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
