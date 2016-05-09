'use strict';

var app = require('../..');
import request from 'supertest';

var newIndustry;

describe('Industry API:', function () {

  describe('GET /api/industries', function () {
    var industrys;

    beforeEach(function (done) {
      request(app)
        .get('/api/industries')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          industrys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      industrys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/industries', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/industries')
        .send({
          name: 'New Industry',
          info: 'This is the brand new industry!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newIndustry = res.body;
          done();
        });
    });

    it('should respond with the newly created industry', function () {
      newIndustry.name.should.equal('New Industry');
      newIndustry.info.should.equal('This is the brand new industry!!!');
    });

  });

  describe('GET /api/industries/:id', function () {
    var industry;

    beforeEach(function (done) {
      request(app)
        .get('/api/industries/' + newIndustry._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          industry = res.body;
          done();
        });
    });

    afterEach(function () {
      industry = {};
    });

    it('should respond with the requested industry', function () {
      industry.name.should.equal('New Industry');
      industry.info.should.equal('This is the brand new industry!!!');
    });

  });

  describe('PUT /api/industries/:id', function () {
    var updatedIndustry;

    beforeEach(function (done) {
      request(app)
        .put('/api/industries/' + newIndustry._id)
        .send({
          name: 'Updated Industry',
          info: 'This is the updated industry!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedIndustry = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedIndustry = {};
    });

    it('should respond with the updated industry', function () {
      updatedIndustry.name.should.equal('Updated Industry');
      updatedIndustry.info.should.equal('This is the updated industry!!!');
    });

  });

  describe('DELETE /api/industries/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/industries/' + newIndustry._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when industry does not exist', function (done) {
      request(app)
        .delete('/api/industries/' + newIndustry._id)
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
