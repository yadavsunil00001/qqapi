

var app = require('../..');
import request from 'supertest';

var newEndpoint;

describe('Endpoint API:', function () {

  describe('GET /api/endpoints', function () {
    var endpoints;

    beforeEach(function (done) {
      request(app)
        .get('/api/endpoints')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          endpoints = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      endpoints.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/endpoints', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/endpoints')
        .send({
          name: 'New Endpoint',
          info: 'This is the brand new endpoint!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newEndpoint = res.body;
          done();
        });
    });

    it('should respond with the newly created endpoint', function () {
      newEndpoint.name.should.equal('New Endpoint');
      newEndpoint.info.should.equal('This is the brand new endpoint!!!');
    });

  });

  describe('GET /api/endpoints/:id', function () {
    var endpoint;

    beforeEach(function (done) {
      request(app)
        .get('/api/endpoints/' + newEndpoint._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          endpoint = res.body;
          done();
        });
    });

    afterEach(function () {
      endpoint = {};
    });

    it('should respond with the requested endpoint', function () {
      endpoint.name.should.equal('New Endpoint');
      endpoint.info.should.equal('This is the brand new endpoint!!!');
    });

  });

  describe('PUT /api/endpoints/:id', function () {
    var updatedEndpoint;

    beforeEach(function (done) {
      request(app)
        .put('/api/endpoints/' + newEndpoint._id)
        .send({
          name: 'Updated Endpoint',
          info: 'This is the updated endpoint!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedEndpoint = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedEndpoint = {};
    });

    it('should respond with the updated endpoint', function () {
      updatedEndpoint.name.should.equal('Updated Endpoint');
      updatedEndpoint.info.should.equal('This is the updated endpoint!!!');
    });

  });

  describe('DELETE /api/endpoints/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/endpoints/' + newEndpoint._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when endpoint does not exist', function (done) {
      request(app)
        .delete('/api/endpoints/' + newEndpoint._id)
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
