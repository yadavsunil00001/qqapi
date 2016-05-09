

var app = require('../..');
import request from 'supertest';

var newExperience;

describe('Experience API:', function () {

  describe('GET /api/experiences', function () {
    var experiences;

    beforeEach(function (done) {
      request(app)
        .get('/api/experiences')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          experiences = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      experiences.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/experiences', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/experiences')
        .send({
          name: 'New Experience',
          info: 'This is the brand new experience!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newExperience = res.body;
          done();
        });
    });

    it('should respond with the newly created experience', function () {
      newExperience.name.should.equal('New Experience');
      newExperience.info.should.equal('This is the brand new experience!!!');
    });

  });

  describe('GET /api/experiences/:id', function () {
    var experience;

    beforeEach(function (done) {
      request(app)
        .get('/api/experiences/' + newExperience._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          experience = res.body;
          done();
        });
    });

    afterEach(function () {
      experience = {};
    });

    it('should respond with the requested experience', function () {
      experience.name.should.equal('New Experience');
      experience.info.should.equal('This is the brand new experience!!!');
    });

  });

  describe('PUT /api/experiences/:id', function () {
    var updatedExperience;

    beforeEach(function (done) {
      request(app)
        .put('/api/experiences/' + newExperience._id)
        .send({
          name: 'Updated Experience',
          info: 'This is the updated experience!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedExperience = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedExperience = {};
    });

    it('should respond with the updated experience', function () {
      updatedExperience.name.should.equal('Updated Experience');
      updatedExperience.info.should.equal('This is the updated experience!!!');
    });

  });

  describe('DELETE /api/experiences/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/experiences/' + newExperience._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when experience does not exist', function (done) {
      request(app)
        .delete('/api/experiences/' + newExperience._id)
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
