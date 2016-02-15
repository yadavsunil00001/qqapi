'use strict';

var app = require('../..');
import request from 'supertest';

var newJobAllocation;

describe('JobAllocation API:', function() {

  describe('GET /api/jobAllocations', function() {
    var jobAllocations;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobAllocations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobAllocations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      jobAllocations.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobAllocations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/jobAllocations')
        .send({
          name: 'New JobAllocation',
          info: 'This is the brand new jobAllocation!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobAllocation = res.body;
          done();
        });
    });

    it('should respond with the newly created jobAllocation', function() {
      newJobAllocation.name.should.equal('New JobAllocation');
      newJobAllocation.info.should.equal('This is the brand new jobAllocation!!!');
    });

  });

  describe('GET /api/jobAllocations/:id', function() {
    var jobAllocation;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobAllocations/' + newJobAllocation._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobAllocation = res.body;
          done();
        });
    });

    afterEach(function() {
      jobAllocation = {};
    });

    it('should respond with the requested jobAllocation', function() {
      jobAllocation.name.should.equal('New JobAllocation');
      jobAllocation.info.should.equal('This is the brand new jobAllocation!!!');
    });

  });

  describe('PUT /api/jobAllocations/:id', function() {
    var updatedJobAllocation;

    beforeEach(function(done) {
      request(app)
        .put('/api/jobAllocations/' + newJobAllocation._id)
        .send({
          name: 'Updated JobAllocation',
          info: 'This is the updated jobAllocation!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedJobAllocation = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedJobAllocation = {};
    });

    it('should respond with the updated jobAllocation', function() {
      updatedJobAllocation.name.should.equal('Updated JobAllocation');
      updatedJobAllocation.info.should.equal('This is the updated jobAllocation!!!');
    });

  });

  describe('DELETE /api/jobAllocations/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/jobAllocations/' + newJobAllocation._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobAllocation does not exist', function(done) {
      request(app)
        .delete('/api/jobAllocations/' + newJobAllocation._id)
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
