'use strict';

var app = require('../..');
import request from 'supertest';

var newApplicantView;

describe('ApplicantView API:', function () {

  describe('GET /api/applicantViews', function () {
    var applicantViews;

    beforeEach(function (done) {
      request(app)
        .get('/api/applicantViews')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantViews = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      applicantViews.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/applicantViews', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/applicantViews')
        .send({
          name: 'New ApplicantView',
          info: 'This is the brand new applicantView!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newApplicantView = res.body;
          done();
        });
    });

    it('should respond with the newly created applicantView', function () {
      newApplicantView.name.should.equal('New ApplicantView');
      newApplicantView.info.should.equal('This is the brand new applicantView!!!');
    });

  });

  describe('GET /api/applicantViews/:id', function () {
    var applicantView;

    beforeEach(function (done) {
      request(app)
        .get('/api/applicantViews/' + newApplicantView._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantView = res.body;
          done();
        });
    });

    afterEach(function () {
      applicantView = {};
    });

    it('should respond with the requested applicantView', function () {
      applicantView.name.should.equal('New ApplicantView');
      applicantView.info.should.equal('This is the brand new applicantView!!!');
    });

  });

  describe('PUT /api/applicantViews/:id', function () {
    var updatedApplicantView;

    beforeEach(function (done) {
      request(app)
        .put('/api/applicantViews/' + newApplicantView._id)
        .send({
          name: 'Updated ApplicantView',
          info: 'This is the updated applicantView!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedApplicantView = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedApplicantView = {};
    });

    it('should respond with the updated applicantView', function () {
      updatedApplicantView.name.should.equal('Updated ApplicantView');
      updatedApplicantView.info.should.equal('This is the updated applicantView!!!');
    });

  });

  describe('DELETE /api/applicantViews/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/applicantViews/' + newApplicantView._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when applicantView does not exist', function (done) {
      request(app)
        .delete('/api/applicantViews/' + newApplicantView._id)
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
