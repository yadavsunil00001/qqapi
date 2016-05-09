'use strict';

var app = require('../..');
import request from 'supertest';

var newReferral;

describe('Referral API:', function () {

  describe('GET /api/referrals', function () {
    var referrals;

    beforeEach(function (done) {
      request(app)
        .get('/api/referrals')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          referrals = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      referrals.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/referrals', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/referrals')
        .send({
          name: 'New Referral',
          info: 'This is the brand new referral!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newReferral = res.body;
          done();
        });
    });

    it('should respond with the newly created referral', function () {
      newReferral.name.should.equal('New Referral');
      newReferral.info.should.equal('This is the brand new referral!!!');
    });

  });

  describe('GET /api/referrals/:id', function () {
    var referral;

    beforeEach(function (done) {
      request(app)
        .get('/api/referrals/' + newReferral._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          referral = res.body;
          done();
        });
    });

    afterEach(function () {
      referral = {};
    });

    it('should respond with the requested referral', function () {
      referral.name.should.equal('New Referral');
      referral.info.should.equal('This is the brand new referral!!!');
    });

  });

  describe('PUT /api/referrals/:id', function () {
    var updatedReferral;

    beforeEach(function (done) {
      request(app)
        .put('/api/referrals/' + newReferral._id)
        .send({
          name: 'Updated Referral',
          info: 'This is the updated referral!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedReferral = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedReferral = {};
    });

    it('should respond with the updated referral', function () {
      updatedReferral.name.should.equal('Updated Referral');
      updatedReferral.info.should.equal('This is the updated referral!!!');
    });

  });

  describe('DELETE /api/referrals/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/referrals/' + newReferral._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when referral does not exist', function (done) {
      request(app)
        .delete('/api/referrals/' + newReferral._id)
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
