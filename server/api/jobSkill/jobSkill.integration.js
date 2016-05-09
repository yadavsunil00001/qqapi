'use strict';

var app = require('../..');
import request from 'supertest';

var newJobSkill;

describe('JobSkill API:', function () {

  describe('GET /api/jobSkills', function () {
    var jobSkills;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobSkills')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobSkills = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      jobSkills.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobSkills', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/jobSkills')
        .send({
          name: 'New JobSkill',
          info: 'This is the brand new jobSkill!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobSkill = res.body;
          done();
        });
    });

    it('should respond with the newly created jobSkill', function () {
      newJobSkill.name.should.equal('New JobSkill');
      newJobSkill.info.should.equal('This is the brand new jobSkill!!!');
    });

  });

  describe('GET /api/jobSkills/:id', function () {
    var jobSkill;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobSkills/' + newJobSkill._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobSkill = res.body;
          done();
        });
    });

    afterEach(function () {
      jobSkill = {};
    });

    it('should respond with the requested jobSkill', function () {
      jobSkill.name.should.equal('New JobSkill');
      jobSkill.info.should.equal('This is the brand new jobSkill!!!');
    });

  });

  describe('PUT /api/jobSkills/:id', function () {
    var updatedJobSkill;

    beforeEach(function (done) {
      request(app)
        .put('/api/jobSkills/' + newJobSkill._id)
        .send({
          name: 'Updated JobSkill',
          info: 'This is the updated jobSkill!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedJobSkill = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedJobSkill = {};
    });

    it('should respond with the updated jobSkill', function () {
      updatedJobSkill.name.should.equal('Updated JobSkill');
      updatedJobSkill.info.should.equal('This is the updated jobSkill!!!');
    });

  });

  describe('DELETE /api/jobSkills/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/jobSkills/' + newJobSkill._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobSkill does not exist', function (done) {
      request(app)
        .delete('/api/jobSkills/' + newJobSkill._id)
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
