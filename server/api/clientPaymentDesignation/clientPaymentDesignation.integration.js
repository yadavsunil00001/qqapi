

var app = require('../..');
import request from 'supertest';

var newClientPaymentDesignation;

describe('ClientPaymentDesignation API:', function () {

  describe('GET /api/clientPaymentDesignations', function () {
    var clientPaymentDesignations;

    beforeEach(function (done) {
      request(app)
        .get('/api/clientPaymentDesignations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          clientPaymentDesignations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      clientPaymentDesignations.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/clientPaymentDesignations', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/clientPaymentDesignations')
        .send({
          name: 'New ClientPaymentDesignation',
          info: 'This is the brand new clientPaymentDesignation!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newClientPaymentDesignation = res.body;
          done();
        });
    });

    it('should respond with the newly created clientPaymentDesignation', function () {
      newClientPaymentDesignation.name.should.equal('New ClientPaymentDesignation');
      newClientPaymentDesignation.info.should.equal('This is the brand new clientPaymentDesignation!!!');
    });

  });

  describe('GET /api/clientPaymentDesignations/:id', function () {
    var clientPaymentDesignation;

    beforeEach(function (done) {
      request(app)
        .get('/api/clientPaymentDesignations/' + newClientPaymentDesignation._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          clientPaymentDesignation = res.body;
          done();
        });
    });

    afterEach(function () {
      clientPaymentDesignation = {};
    });

    it('should respond with the requested clientPaymentDesignation', function () {
      clientPaymentDesignation.name.should.equal('New ClientPaymentDesignation');
      clientPaymentDesignation.info.should.equal('This is the brand new clientPaymentDesignation!!!');
    });

  });

  describe('PUT /api/clientPaymentDesignations/:id', function () {
    var updatedClientPaymentDesignation;

    beforeEach(function (done) {
      request(app)
        .put('/api/clientPaymentDesignations/' + newClientPaymentDesignation._id)
        .send({
          name: 'Updated ClientPaymentDesignation',
          info: 'This is the updated clientPaymentDesignation!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedClientPaymentDesignation = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedClientPaymentDesignation = {};
    });

    it('should respond with the updated clientPaymentDesignation', function () {
      updatedClientPaymentDesignation.name.should.equal('Updated ClientPaymentDesignation');
      updatedClientPaymentDesignation.info.should.equal('This is the updated clientPaymentDesignation!!!');
    });

  });

  describe('DELETE /api/clientPaymentDesignations/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/clientPaymentDesignations/' + newClientPaymentDesignation._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when clientPaymentDesignation does not exist', function (done) {
      request(app)
        .delete('/api/clientPaymentDesignations/' + newClientPaymentDesignation._id)
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
