'use strict';

var app = require('../..');
import request from 'supertest';

var newResume;

describe('Resume API:', function() {

  describe('GET /api/resumes', function() {
    var resumes;

    beforeEach(function(done) {
      request(app)
        .get('/api/resumes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          resumes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      resumes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/resumes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/resumes')
        .send({
          name: 'New Resume',
          info: 'This is the brand new resume!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newResume = res.body;
          done();
        });
    });

    it('should respond with the newly created resume', function() {
      newResume.name.should.equal('New Resume');
      newResume.info.should.equal('This is the brand new resume!!!');
    });

  });

  describe('GET /api/resumes/:id', function() {
    var resume;

    beforeEach(function(done) {
      request(app)
        .get('/api/resumes/' + newResume._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          resume = res.body;
          done();
        });
    });

    afterEach(function() {
      resume = {};
    });

    it('should respond with the requested resume', function() {
      resume.name.should.equal('New Resume');
      resume.info.should.equal('This is the brand new resume!!!');
    });

  });

  describe('PUT /api/resumes/:id', function() {
    var updatedResume;

    beforeEach(function(done) {
      request(app)
        .put('/api/resumes/' + newResume._id)
        .send({
          name: 'Updated Resume',
          info: 'This is the updated resume!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedResume = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedResume = {};
    });

    it('should respond with the updated resume', function() {
      updatedResume.name.should.equal('Updated Resume');
      updatedResume.info.should.equal('This is the updated resume!!!');
    });

  });

  describe('DELETE /api/resumes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/resumes/' + newResume._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when resume does not exist', function(done) {
      request(app)
        .delete('/api/resumes/' + newResume._id)
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
