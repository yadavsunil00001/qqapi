'use strict';

var app = require('../..');
import request from 'supertest';

var newEducation;

describe('Education API:', function() {

  describe('GET /api/educations', function() {
    var educations;

    beforeEach(function(done) {
      request(app)
        .get('/api/educations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          educations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      educations.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/educations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/educations')
        .send({
          name: 'New Education',
          info: 'This is the brand new education!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newEducation = res.body;
          done();
        });
    });

    it('should respond with the newly created education', function() {
      newEducation.name.should.equal('New Education');
      newEducation.info.should.equal('This is the brand new education!!!');
    });

  });

  describe('GET /api/educations/:id', function() {
    var education;

    beforeEach(function(done) {
      request(app)
        .get('/api/educations/' + newEducation._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          education = res.body;
          done();
        });
    });

    afterEach(function() {
      education = {};
    });

    it('should respond with the requested education', function() {
      education.name.should.equal('New Education');
      education.info.should.equal('This is the brand new education!!!');
    });

  });

  describe('PUT /api/educations/:id', function() {
    var updatedEducation;

    beforeEach(function(done) {
      request(app)
        .put('/api/educations/' + newEducation._id)
        .send({
          name: 'Updated Education',
          info: 'This is the updated education!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedEducation = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEducation = {};
    });

    it('should respond with the updated education', function() {
      updatedEducation.name.should.equal('Updated Education');
      updatedEducation.info.should.equal('This is the updated education!!!');
    });

  });

  describe('DELETE /api/educations/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/educations/' + newEducation._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when education does not exist', function(done) {
      request(app)
        .delete('/api/educations/' + newEducation._id)
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
