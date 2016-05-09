'use strict';

var app = require('../..');
import request from 'supertest';

var newSummary;

describe('Summary API:', function () {

  describe('GET /api/summary', function () {
    var summarys;

    beforeEach(function (done) {
      request(app)
        .get('/api/summary')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          summarys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      summarys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/summary', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/summary')
        .send({
          name: 'New Summary',
          info: 'This is the brand new summary!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newSummary = res.body;
          done();
        });
    });

    it('should respond with the newly created summary', function () {
      newSummary.name.should.equal('New Summary');
      newSummary.info.should.equal('This is the brand new summary!!!');
    });

  });

  describe('GET /api/summary/:id', function () {
    var summary;

    beforeEach(function (done) {
      request(app)
        .get('/api/summary/' + newSummary._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          summary = res.body;
          done();
        });
    });

    afterEach(function () {
      summary = {};
    });

    it('should respond with the requested summary', function () {
      summary.name.should.equal('New Summary');
      summary.info.should.equal('This is the brand new summary!!!');
    });

  });

  describe('PUT /api/summary/:id', function () {
    var updatedSummary;

    beforeEach(function (done) {
      request(app)
        .put('/api/summary/' + newSummary._id)
        .send({
          name: 'Updated Summary',
          info: 'This is the updated summary!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedSummary = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedSummary = {};
    });

    it('should respond with the updated summary', function () {
      updatedSummary.name.should.equal('Updated Summary');
      updatedSummary.info.should.equal('This is the updated summary!!!');
    });

  });

  describe('DELETE /api/summary/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/summary/' + newSummary._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when summary does not exist', function (done) {
      request(app)
        .delete('/api/summary/' + newSummary._id)
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
