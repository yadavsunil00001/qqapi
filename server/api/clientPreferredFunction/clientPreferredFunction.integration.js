

var app = require('../..');
import request from 'supertest';

var newClientPreferredFunction;

describe('ClientPreferredFunction API:', function () {

  describe('GET /api/clientPreferredFunctions', function () {
    var clientPreferredFunctions;

    beforeEach(function (done) {
      request(app)
        .get('/api/clientPreferredFunctions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          clientPreferredFunctions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      clientPreferredFunctions.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/clientPreferredFunctions', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/clientPreferredFunctions')
        .send({
          name: 'New ClientPreferredFunction',
          info: 'This is the brand new clientPreferredFunction!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newClientPreferredFunction = res.body;
          done();
        });
    });

    it('should respond with the newly created clientPreferredFunction', function () {
      newClientPreferredFunction.name.should.equal('New ClientPreferredFunction');
      newClientPreferredFunction.info.should.equal('This is the brand new clientPreferredFunction!!!');
    });

  });

  describe('GET /api/clientPreferredFunctions/:id', function () {
    var clientPreferredFunction;

    beforeEach(function (done) {
      request(app)
        .get('/api/clientPreferredFunctions/' + newClientPreferredFunction._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          clientPreferredFunction = res.body;
          done();
        });
    });

    afterEach(function () {
      clientPreferredFunction = {};
    });

    it('should respond with the requested clientPreferredFunction', function () {
      clientPreferredFunction.name.should.equal('New ClientPreferredFunction');
      clientPreferredFunction.info.should.equal('This is the brand new clientPreferredFunction!!!');
    });

  });

  describe('PUT /api/clientPreferredFunctions/:id', function () {
    var updatedClientPreferredFunction;

    beforeEach(function (done) {
      request(app)
        .put('/api/clientPreferredFunctions/' + newClientPreferredFunction._id)
        .send({
          name: 'Updated ClientPreferredFunction',
          info: 'This is the updated clientPreferredFunction!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedClientPreferredFunction = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedClientPreferredFunction = {};
    });

    it('should respond with the updated clientPreferredFunction', function () {
      updatedClientPreferredFunction.name.should.equal('Updated ClientPreferredFunction');
      updatedClientPreferredFunction.info.should.equal('This is the updated clientPreferredFunction!!!');
    });

  });

  describe('DELETE /api/clientPreferredFunctions/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/clientPreferredFunctions/' + newClientPreferredFunction._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when clientPreferredFunction does not exist', function (done) {
      request(app)
        .delete('/api/clientPreferredFunctions/' + newClientPreferredFunction._id)
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
