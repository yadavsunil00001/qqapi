'use strict';

var app = require('../..');
import request from 'supertest';

var newJobComment;

describe('JobComment API:', function() {

  describe('GET /api/jobComments', function() {
    var jobComments;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobComments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobComments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      jobComments.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobComments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/jobComments')
        .send({
          name: 'New JobComment',
          info: 'This is the brand new jobComment!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobComment = res.body;
          done();
        });
    });

    it('should respond with the newly created jobComment', function() {
      newJobComment.name.should.equal('New JobComment');
      newJobComment.info.should.equal('This is the brand new jobComment!!!');
    });

  });

  describe('GET /api/jobComments/:id', function() {
    var jobComment;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobComments/' + newJobComment._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobComment = res.body;
          done();
        });
    });

    afterEach(function() {
      jobComment = {};
    });

    it('should respond with the requested jobComment', function() {
      jobComment.name.should.equal('New JobComment');
      jobComment.info.should.equal('This is the brand new jobComment!!!');
    });

  });

  describe('PUT /api/jobComments/:id', function() {
    var updatedJobComment;

    beforeEach(function(done) {
      request(app)
        .put('/api/jobComments/' + newJobComment._id)
        .send({
          name: 'Updated JobComment',
          info: 'This is the updated jobComment!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedJobComment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedJobComment = {};
    });

    it('should respond with the updated jobComment', function() {
      updatedJobComment.name.should.equal('Updated JobComment');
      updatedJobComment.info.should.equal('This is the updated jobComment!!!');
    });

  });

  describe('DELETE /api/jobComments/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/jobComments/' + newJobComment._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobComment does not exist', function(done) {
      request(app)
        .delete('/api/jobComments/' + newJobComment._id)
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
