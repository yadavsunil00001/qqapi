'use strict';

var app = require('../..');
import request from 'supertest';

var newEmployer;

describe('Employer API:', function() {

  describe('GET /api/employers', function() {
    var employers;

    beforeEach(function(done) {
      request(app)
        .get('/api/employers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          employers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      employers.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/employers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/employers')
        .send({
          name: 'New Employer',
          info: 'This is the brand new employer!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newEmployer = res.body;
          done();
        });
    });

    it('should respond with the newly created employer', function() {
      newEmployer.name.should.equal('New Employer');
      newEmployer.info.should.equal('This is the brand new employer!!!');
    });

  });

  describe('GET /api/employers/:id', function() {
    var employer;

    beforeEach(function(done) {
      request(app)
        .get('/api/employers/' + newEmployer._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          employer = res.body;
          done();
        });
    });

    afterEach(function() {
      employer = {};
    });

    it('should respond with the requested employer', function() {
      employer.name.should.equal('New Employer');
      employer.info.should.equal('This is the brand new employer!!!');
    });

  });

  describe('PUT /api/employers/:id', function() {
    var updatedEmployer;

    beforeEach(function(done) {
      request(app)
        .put('/api/employers/' + newEmployer._id)
        .send({
          name: 'Updated Employer',
          info: 'This is the updated employer!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedEmployer = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEmployer = {};
    });

    it('should respond with the updated employer', function() {
      updatedEmployer.name.should.equal('Updated Employer');
      updatedEmployer.info.should.equal('This is the updated employer!!!');
    });

  });

  describe('DELETE /api/employers/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/employers/' + newEmployer._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when employer does not exist', function(done) {
      request(app)
        .delete('/api/employers/' + newEmployer._id)
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
