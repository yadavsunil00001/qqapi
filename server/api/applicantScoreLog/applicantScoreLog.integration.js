'use strict';

var app = require('../..');
import request from 'supertest';

var newApplicantScoreLog;

describe('ApplicantScoreLog API:', function() {

  describe('GET /api/applicantScoreLogs', function() {
    var applicantScoreLogs;

    beforeEach(function(done) {
      request(app)
        .get('/api/applicantScoreLogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantScoreLogs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      applicantScoreLogs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/applicantScoreLogs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/applicantScoreLogs')
        .send({
          name: 'New ApplicantScoreLog',
          info: 'This is the brand new applicantScoreLog!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newApplicantScoreLog = res.body;
          done();
        });
    });

    it('should respond with the newly created applicantScoreLog', function() {
      newApplicantScoreLog.name.should.equal('New ApplicantScoreLog');
      newApplicantScoreLog.info.should.equal('This is the brand new applicantScoreLog!!!');
    });

  });

  describe('GET /api/applicantScoreLogs/:id', function() {
    var applicantScoreLog;

    beforeEach(function(done) {
      request(app)
        .get('/api/applicantScoreLogs/' + newApplicantScoreLog._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantScoreLog = res.body;
          done();
        });
    });

    afterEach(function() {
      applicantScoreLog = {};
    });

    it('should respond with the requested applicantScoreLog', function() {
      applicantScoreLog.name.should.equal('New ApplicantScoreLog');
      applicantScoreLog.info.should.equal('This is the brand new applicantScoreLog!!!');
    });

  });

  describe('PUT /api/applicantScoreLogs/:id', function() {
    var updatedApplicantScoreLog;

    beforeEach(function(done) {
      request(app)
        .put('/api/applicantScoreLogs/' + newApplicantScoreLog._id)
        .send({
          name: 'Updated ApplicantScoreLog',
          info: 'This is the updated applicantScoreLog!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedApplicantScoreLog = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedApplicantScoreLog = {};
    });

    it('should respond with the updated applicantScoreLog', function() {
      updatedApplicantScoreLog.name.should.equal('Updated ApplicantScoreLog');
      updatedApplicantScoreLog.info.should.equal('This is the updated applicantScoreLog!!!');
    });

  });

  describe('DELETE /api/applicantScoreLogs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/applicantScoreLogs/' + newApplicantScoreLog._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when applicantScoreLog does not exist', function(done) {
      request(app)
        .delete('/api/applicantScoreLogs/' + newApplicantScoreLog._id)
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
