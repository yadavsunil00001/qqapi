'use strict';

var app = require('../..');
import request from 'supertest';

var newJobsIndustry;

describe('JobsIndustry API:', function() {

  describe('GET /api/jobsIndustries', function() {
    var jobsIndustrys;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobsIndustries')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobsIndustrys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      jobsIndustrys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobsIndustries', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/jobsIndustries')
        .send({
          name: 'New JobsIndustry',
          info: 'This is the brand new jobsIndustry!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobsIndustry = res.body;
          done();
        });
    });

    it('should respond with the newly created jobsIndustry', function() {
      newJobsIndustry.name.should.equal('New JobsIndustry');
      newJobsIndustry.info.should.equal('This is the brand new jobsIndustry!!!');
    });

  });

  describe('GET /api/jobsIndustries/:id', function() {
    var jobsIndustry;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobsIndustries/' + newJobsIndustry._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobsIndustry = res.body;
          done();
        });
    });

    afterEach(function() {
      jobsIndustry = {};
    });

    it('should respond with the requested jobsIndustry', function() {
      jobsIndustry.name.should.equal('New JobsIndustry');
      jobsIndustry.info.should.equal('This is the brand new jobsIndustry!!!');
    });

  });

  describe('PUT /api/jobsIndustries/:id', function() {
    var updatedJobsIndustry;

    beforeEach(function(done) {
      request(app)
        .put('/api/jobsIndustries/' + newJobsIndustry._id)
        .send({
          name: 'Updated JobsIndustry',
          info: 'This is the updated jobsIndustry!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedJobsIndustry = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedJobsIndustry = {};
    });

    it('should respond with the updated jobsIndustry', function() {
      updatedJobsIndustry.name.should.equal('Updated JobsIndustry');
      updatedJobsIndustry.info.should.equal('This is the updated jobsIndustry!!!');
    });

  });

  describe('DELETE /api/jobsIndustries/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/jobsIndustries/' + newJobsIndustry._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobsIndustry does not exist', function(done) {
      request(app)
        .delete('/api/jobsIndustries/' + newJobsIndustry._id)
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
