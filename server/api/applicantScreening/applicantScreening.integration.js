'use strict';

var app = require('../..');
import request from 'supertest';

var newApplicantScreening;

describe('ApplicantScreening API:', function() {

  describe('GET /api/applicantScreenings', function() {
    var applicantScreenings;

    beforeEach(function(done) {
      request(app)
        .get('/api/applicantScreenings')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantScreenings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      applicantScreenings.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/applicantScreenings', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/applicantScreenings')
        .send({
          name: 'New ApplicantScreening',
          info: 'This is the brand new applicantScreening!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newApplicantScreening = res.body;
          done();
        });
    });

    it('should respond with the newly created applicantScreening', function() {
      newApplicantScreening.name.should.equal('New ApplicantScreening');
      newApplicantScreening.info.should.equal('This is the brand new applicantScreening!!!');
    });

  });

  describe('GET /api/applicantScreenings/:id', function() {
    var applicantScreening;

    beforeEach(function(done) {
      request(app)
        .get('/api/applicantScreenings/' + newApplicantScreening._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantScreening = res.body;
          done();
        });
    });

    afterEach(function() {
      applicantScreening = {};
    });

    it('should respond with the requested applicantScreening', function() {
      applicantScreening.name.should.equal('New ApplicantScreening');
      applicantScreening.info.should.equal('This is the brand new applicantScreening!!!');
    });

  });

  describe('PUT /api/applicantScreenings/:id', function() {
    var updatedApplicantScreening;

    beforeEach(function(done) {
      request(app)
        .put('/api/applicantScreenings/' + newApplicantScreening._id)
        .send({
          name: 'Updated ApplicantScreening',
          info: 'This is the updated applicantScreening!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedApplicantScreening = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedApplicantScreening = {};
    });

    it('should respond with the updated applicantScreening', function() {
      updatedApplicantScreening.name.should.equal('Updated ApplicantScreening');
      updatedApplicantScreening.info.should.equal('This is the updated applicantScreening!!!');
    });

  });

  describe('DELETE /api/applicantScreenings/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/applicantScreenings/' + newApplicantScreening._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when applicantScreening does not exist', function(done) {
      request(app)
        .delete('/api/applicantScreenings/' + newApplicantScreening._id)
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
