

var app = require('../..');
import request from 'supertest';

var newJobStatusLog;

describe('JobStatusLog API:', function () {

  describe('GET /api/jobStatusLogs', function () {
    var jobStatusLogs;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobStatusLogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobStatusLogs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      jobStatusLogs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobStatusLogs', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/jobStatusLogs')
        .send({
          name: 'New JobStatusLog',
          info: 'This is the brand new jobStatusLog!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobStatusLog = res.body;
          done();
        });
    });

    it('should respond with the newly created jobStatusLog', function () {
      newJobStatusLog.name.should.equal('New JobStatusLog');
      newJobStatusLog.info.should.equal('This is the brand new jobStatusLog!!!');
    });

  });

  describe('GET /api/jobStatusLogs/:id', function () {
    var jobStatusLog;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobStatusLogs/' + newJobStatusLog._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobStatusLog = res.body;
          done();
        });
    });

    afterEach(function () {
      jobStatusLog = {};
    });

    it('should respond with the requested jobStatusLog', function () {
      jobStatusLog.name.should.equal('New JobStatusLog');
      jobStatusLog.info.should.equal('This is the brand new jobStatusLog!!!');
    });

  });

  describe('PUT /api/jobStatusLogs/:id', function () {
    var updatedJobStatusLog;

    beforeEach(function (done) {
      request(app)
        .put('/api/jobStatusLogs/' + newJobStatusLog._id)
        .send({
          name: 'Updated JobStatusLog',
          info: 'This is the updated jobStatusLog!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedJobStatusLog = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedJobStatusLog = {};
    });

    it('should respond with the updated jobStatusLog', function () {
      updatedJobStatusLog.name.should.equal('Updated JobStatusLog');
      updatedJobStatusLog.info.should.equal('This is the updated jobStatusLog!!!');
    });

  });

  describe('DELETE /api/jobStatusLogs/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/jobStatusLogs/' + newJobStatusLog._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobStatusLog does not exist', function (done) {
      request(app)
        .delete('/api/jobStatusLogs/' + newJobStatusLog._id)
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
