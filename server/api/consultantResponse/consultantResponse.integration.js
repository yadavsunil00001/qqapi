'use strict';

var app = require('../..');
import request from 'supertest';

var newConsultantResponse;

describe('ConsultantResponse API:', function () {

  describe('GET /api/consultantResponses', function () {
    var consultantResponses;

    beforeEach(function (done) {
      request(app)
        .get('/api/consultantResponses')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          consultantResponses = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      consultantResponses.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/consultantResponses', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/consultantResponses')
        .send({
          name: 'New ConsultantResponse',
          info: 'This is the brand new consultantResponse!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newConsultantResponse = res.body;
          done();
        });
    });

    it('should respond with the newly created consultantResponse', function () {
      newConsultantResponse.name.should.equal('New ConsultantResponse');
      newConsultantResponse.info.should.equal('This is the brand new consultantResponse!!!');
    });

  });

  describe('GET /api/consultantResponses/:id', function () {
    var consultantResponse;

    beforeEach(function (done) {
      request(app)
        .get('/api/consultantResponses/' + newConsultantResponse._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          consultantResponse = res.body;
          done();
        });
    });

    afterEach(function () {
      consultantResponse = {};
    });

    it('should respond with the requested consultantResponse', function () {
      consultantResponse.name.should.equal('New ConsultantResponse');
      consultantResponse.info.should.equal('This is the brand new consultantResponse!!!');
    });

  });

  describe('PUT /api/consultantResponses/:id', function () {
    var updatedConsultantResponse;

    beforeEach(function (done) {
      request(app)
        .put('/api/consultantResponses/' + newConsultantResponse._id)
        .send({
          name: 'Updated ConsultantResponse',
          info: 'This is the updated consultantResponse!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedConsultantResponse = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedConsultantResponse = {};
    });

    it('should respond with the updated consultantResponse', function () {
      updatedConsultantResponse.name.should.equal('Updated ConsultantResponse');
      updatedConsultantResponse.info.should.equal('This is the updated consultantResponse!!!');
    });

  });

  describe('DELETE /api/consultantResponses/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/consultantResponses/' + newConsultantResponse._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when consultantResponse does not exist', function (done) {
      request(app)
        .delete('/api/consultantResponses/' + newConsultantResponse._id)
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
