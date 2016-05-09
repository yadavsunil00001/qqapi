'use strict';

var app = require('../..');
import request from 'supertest';

var newInstitute;

describe('Institute API:', function () {

  describe('GET /api/institutes', function () {
    var institutes;

    beforeEach(function (done) {
      request(app)
        .get('/api/institutes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          institutes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      institutes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/institutes', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/institutes')
        .send({
          name: 'New Institute',
          info: 'This is the brand new institute!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newInstitute = res.body;
          done();
        });
    });

    it('should respond with the newly created institute', function () {
      newInstitute.name.should.equal('New Institute');
      newInstitute.info.should.equal('This is the brand new institute!!!');
    });

  });

  describe('GET /api/institutes/:id', function () {
    var institute;

    beforeEach(function (done) {
      request(app)
        .get('/api/institutes/' + newInstitute._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          institute = res.body;
          done();
        });
    });

    afterEach(function () {
      institute = {};
    });

    it('should respond with the requested institute', function () {
      institute.name.should.equal('New Institute');
      institute.info.should.equal('This is the brand new institute!!!');
    });

  });

  describe('PUT /api/institutes/:id', function () {
    var updatedInstitute;

    beforeEach(function (done) {
      request(app)
        .put('/api/institutes/' + newInstitute._id)
        .send({
          name: 'Updated Institute',
          info: 'This is the updated institute!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedInstitute = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedInstitute = {};
    });

    it('should respond with the updated institute', function () {
      updatedInstitute.name.should.equal('Updated Institute');
      updatedInstitute.info.should.equal('This is the updated institute!!!');
    });

  });

  describe('DELETE /api/institutes/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/institutes/' + newInstitute._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when institute does not exist', function (done) {
      request(app)
        .delete('/api/institutes/' + newInstitute._id)
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
