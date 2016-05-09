'use strict';

var app = require('../..');
import request from 'supertest';

var newApplicantDownload;

describe('ApplicantDownload API:', function () {

  describe('GET /api/applicantDownloads', function () {
    var applicantDownloads;

    beforeEach(function (done) {
      request(app)
        .get('/api/applicantDownloads')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantDownloads = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      applicantDownloads.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/applicantDownloads', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/applicantDownloads')
        .send({
          name: 'New ApplicantDownload',
          info: 'This is the brand new applicantDownload!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newApplicantDownload = res.body;
          done();
        });
    });

    it('should respond with the newly created applicantDownload', function () {
      newApplicantDownload.name.should.equal('New ApplicantDownload');
      newApplicantDownload.info.should.equal('This is the brand new applicantDownload!!!');
    });

  });

  describe('GET /api/applicantDownloads/:id', function () {
    var applicantDownload;

    beforeEach(function (done) {
      request(app)
        .get('/api/applicantDownloads/' + newApplicantDownload._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantDownload = res.body;
          done();
        });
    });

    afterEach(function () {
      applicantDownload = {};
    });

    it('should respond with the requested applicantDownload', function () {
      applicantDownload.name.should.equal('New ApplicantDownload');
      applicantDownload.info.should.equal('This is the brand new applicantDownload!!!');
    });

  });

  describe('PUT /api/applicantDownloads/:id', function () {
    var updatedApplicantDownload;

    beforeEach(function (done) {
      request(app)
        .put('/api/applicantDownloads/' + newApplicantDownload._id)
        .send({
          name: 'Updated ApplicantDownload',
          info: 'This is the updated applicantDownload!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedApplicantDownload = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedApplicantDownload = {};
    });

    it('should respond with the updated applicantDownload', function () {
      updatedApplicantDownload.name.should.equal('Updated ApplicantDownload');
      updatedApplicantDownload.info.should.equal('This is the updated applicantDownload!!!');
    });

  });

  describe('DELETE /api/applicantDownloads/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/applicantDownloads/' + newApplicantDownload._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when applicantDownload does not exist', function (done) {
      request(app)
        .delete('/api/applicantDownloads/' + newApplicantDownload._id)
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
