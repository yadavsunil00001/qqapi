'use strict';

var app = require('../..');
import request from 'supertest';

var newApplicantPreferenceTime;

describe('ApplicantPreferenceTime API:', function () {

  describe('GET /api/applicantPreferenceTimes', function () {
    var applicantPreferenceTimes;

    beforeEach(function (done) {
      request(app)
        .get('/api/applicantPreferenceTimes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantPreferenceTimes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      applicantPreferenceTimes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/applicantPreferenceTimes', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/applicantPreferenceTimes')
        .send({
          name: 'New ApplicantPreferenceTime',
          info: 'This is the brand new applicantPreferenceTime!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newApplicantPreferenceTime = res.body;
          done();
        });
    });

    it('should respond with the newly created applicantPreferenceTime', function () {
      newApplicantPreferenceTime.name.should.equal('New ApplicantPreferenceTime');
      newApplicantPreferenceTime.info.should.equal('This is the brand new applicantPreferenceTime!!!');
    });

  });

  describe('GET /api/applicantPreferenceTimes/:id', function () {
    var applicantPreferenceTime;

    beforeEach(function (done) {
      request(app)
        .get('/api/applicantPreferenceTimes/' + newApplicantPreferenceTime._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantPreferenceTime = res.body;
          done();
        });
    });

    afterEach(function () {
      applicantPreferenceTime = {};
    });

    it('should respond with the requested applicantPreferenceTime', function () {
      applicantPreferenceTime.name.should.equal('New ApplicantPreferenceTime');
      applicantPreferenceTime.info.should.equal('This is the brand new applicantPreferenceTime!!!');
    });

  });

  describe('PUT /api/applicantPreferenceTimes/:id', function () {
    var updatedApplicantPreferenceTime;

    beforeEach(function (done) {
      request(app)
        .put('/api/applicantPreferenceTimes/' + newApplicantPreferenceTime._id)
        .send({
          name: 'Updated ApplicantPreferenceTime',
          info: 'This is the updated applicantPreferenceTime!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedApplicantPreferenceTime = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedApplicantPreferenceTime = {};
    });

    it('should respond with the updated applicantPreferenceTime', function () {
      updatedApplicantPreferenceTime.name.should.equal('Updated ApplicantPreferenceTime');
      updatedApplicantPreferenceTime.info.should.equal('This is the updated applicantPreferenceTime!!!');
    });

  });

  describe('DELETE /api/applicantPreferenceTimes/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/applicantPreferenceTimes/' + newApplicantPreferenceTime._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when applicantPreferenceTime does not exist', function (done) {
      request(app)
        .delete('/api/applicantPreferenceTimes/' + newApplicantPreferenceTime._id)
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
