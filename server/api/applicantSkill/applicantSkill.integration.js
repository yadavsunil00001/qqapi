

var app = require('../..');
import request from 'supertest';

var newApplicantSkill;

describe('ApplicantSkill API:', function () {

  describe('GET /api/applicantSkills', function () {
    var applicantSkills;

    beforeEach(function (done) {
      request(app)
        .get('/api/applicantSkills')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantSkills = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      applicantSkills.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/applicantSkills', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/applicantSkills')
        .send({
          name: 'New ApplicantSkill',
          info: 'This is the brand new applicantSkill!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newApplicantSkill = res.body;
          done();
        });
    });

    it('should respond with the newly created applicantSkill', function () {
      newApplicantSkill.name.should.equal('New ApplicantSkill');
      newApplicantSkill.info.should.equal('This is the brand new applicantSkill!!!');
    });

  });

  describe('GET /api/applicantSkills/:id', function () {
    var applicantSkill;

    beforeEach(function (done) {
      request(app)
        .get('/api/applicantSkills/' + newApplicantSkill._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicantSkill = res.body;
          done();
        });
    });

    afterEach(function () {
      applicantSkill = {};
    });

    it('should respond with the requested applicantSkill', function () {
      applicantSkill.name.should.equal('New ApplicantSkill');
      applicantSkill.info.should.equal('This is the brand new applicantSkill!!!');
    });

  });

  describe('PUT /api/applicantSkills/:id', function () {
    var updatedApplicantSkill;

    beforeEach(function (done) {
      request(app)
        .put('/api/applicantSkills/' + newApplicantSkill._id)
        .send({
          name: 'Updated ApplicantSkill',
          info: 'This is the updated applicantSkill!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedApplicantSkill = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedApplicantSkill = {};
    });

    it('should respond with the updated applicantSkill', function () {
      updatedApplicantSkill.name.should.equal('Updated ApplicantSkill');
      updatedApplicantSkill.info.should.equal('This is the updated applicantSkill!!!');
    });

  });

  describe('DELETE /api/applicantSkills/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/applicantSkills/' + newApplicantSkill._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when applicantSkill does not exist', function (done) {
      request(app)
        .delete('/api/applicantSkills/' + newApplicantSkill._id)
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
