'use strict';

var app = require('../..');
import request from 'supertest';

var newPhoneNumber;

describe('PhoneNumber API:', function () {

  describe('GET /api/phoneNumbers', function () {
    var phoneNumbers;

    beforeEach(function (done) {
      request(app)
        .get('/api/phoneNumbers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          phoneNumbers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      phoneNumbers.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/phoneNumbers', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/phoneNumbers')
        .send({
          name: 'New PhoneNumber',
          info: 'This is the brand new phoneNumber!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPhoneNumber = res.body;
          done();
        });
    });

    it('should respond with the newly created phoneNumber', function () {
      newPhoneNumber.name.should.equal('New PhoneNumber');
      newPhoneNumber.info.should.equal('This is the brand new phoneNumber!!!');
    });

  });

  describe('GET /api/phoneNumbers/:id', function () {
    var phoneNumber;

    beforeEach(function (done) {
      request(app)
        .get('/api/phoneNumbers/' + newPhoneNumber._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          phoneNumber = res.body;
          done();
        });
    });

    afterEach(function () {
      phoneNumber = {};
    });

    it('should respond with the requested phoneNumber', function () {
      phoneNumber.name.should.equal('New PhoneNumber');
      phoneNumber.info.should.equal('This is the brand new phoneNumber!!!');
    });

  });

  describe('PUT /api/phoneNumbers/:id', function () {
    var updatedPhoneNumber;

    beforeEach(function (done) {
      request(app)
        .put('/api/phoneNumbers/' + newPhoneNumber._id)
        .send({
          name: 'Updated PhoneNumber',
          info: 'This is the updated phoneNumber!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedPhoneNumber = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedPhoneNumber = {};
    });

    it('should respond with the updated phoneNumber', function () {
      updatedPhoneNumber.name.should.equal('Updated PhoneNumber');
      updatedPhoneNumber.info.should.equal('This is the updated phoneNumber!!!');
    });

  });

  describe('DELETE /api/phoneNumbers/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/phoneNumbers/' + newPhoneNumber._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when phoneNumber does not exist', function (done) {
      request(app)
        .delete('/api/phoneNumbers/' + newPhoneNumber._id)
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
