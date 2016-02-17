'use strict';

var app = require('../..');
import request from 'supertest';

var newJobsDegree;

describe('JobsDegree API:', function() {

  describe('GET /api/jobsDegrees', function() {
    var jobsDegrees;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobsDegrees')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobsDegrees = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      jobsDegrees.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobsDegrees', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/jobsDegrees')
        .send({
          name: 'New JobsDegree',
          info: 'This is the brand new jobsDegree!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobsDegree = res.body;
          done();
        });
    });

    it('should respond with the newly created jobsDegree', function() {
      newJobsDegree.name.should.equal('New JobsDegree');
      newJobsDegree.info.should.equal('This is the brand new jobsDegree!!!');
    });

  });

  describe('GET /api/jobsDegrees/:id', function() {
    var jobsDegree;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobsDegrees/' + newJobsDegree._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobsDegree = res.body;
          done();
        });
    });

    afterEach(function() {
      jobsDegree = {};
    });

    it('should respond with the requested jobsDegree', function() {
      jobsDegree.name.should.equal('New JobsDegree');
      jobsDegree.info.should.equal('This is the brand new jobsDegree!!!');
    });

  });

  describe('PUT /api/jobsDegrees/:id', function() {
    var updatedJobsDegree;

    beforeEach(function(done) {
      request(app)
        .put('/api/jobsDegrees/' + newJobsDegree._id)
        .send({
          name: 'Updated JobsDegree',
          info: 'This is the updated jobsDegree!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedJobsDegree = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedJobsDegree = {};
    });

    it('should respond with the updated jobsDegree', function() {
      updatedJobsDegree.name.should.equal('Updated JobsDegree');
      updatedJobsDegree.info.should.equal('This is the updated jobsDegree!!!');
    });

  });

  describe('DELETE /api/jobsDegrees/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/jobsDegrees/' + newJobsDegree._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobsDegree does not exist', function(done) {
      request(app)
        .delete('/api/jobsDegrees/' + newJobsDegree._id)
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
