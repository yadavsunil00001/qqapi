

var app = require('../..');
import request from 'supertest';

var newApplicantState;

describe('ApplicantState API:', function () {

  describe('GET /api/applicantStates', function () {
    var applicantStates;

    beforeEach(function (done) {
      request(app)
        .get('/api/applicantStates')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantStates = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      applicantStates.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/applicantStates', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/applicantStates')
        .send({
          name: 'New ApplicantState',
          info: 'This is the brand new applicantState!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newApplicantState = res.body;
          done();
        });
    });

    it('should respond with the newly created applicantState', function () {
      newApplicantState.name.should.equal('New ApplicantState');
      newApplicantState.info.should.equal('This is the brand new applicantState!!!');
    });

  });

  describe('GET /api/applicantStates/:id', function () {
    var applicantState;

    beforeEach(function (done) {
      request(app)
        .get('/api/applicantStates/' + newApplicantState._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantState = res.body;
          done();
        });
    });

    afterEach(function () {
      applicantState = {};
    });

    it('should respond with the requested applicantState', function () {
      applicantState.name.should.equal('New ApplicantState');
      applicantState.info.should.equal('This is the brand new applicantState!!!');
    });

  });

  describe('PUT /api/applicantStates/:id', function () {
    var updatedApplicantState;

    beforeEach(function (done) {
      request(app)
        .put('/api/applicantStates/' + newApplicantState._id)
        .send({
          name: 'Updated ApplicantState',
          info: 'This is the updated applicantState!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedApplicantState = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedApplicantState = {};
    });

    it('should respond with the updated applicantState', function () {
      updatedApplicantState.name.should.equal('Updated ApplicantState');
      updatedApplicantState.info.should.equal('This is the updated applicantState!!!');
    });

  });

  describe('DELETE /api/applicantStates/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/applicantStates/' + newApplicantState._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when applicantState does not exist', function (done) {
      request(app)
        .delete('/api/applicantStates/' + newApplicantState._id)
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
