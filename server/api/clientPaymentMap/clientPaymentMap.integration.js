

var app = require('../..');
import request from 'supertest';

var newClientPaymentMap;

describe('ClientPaymentMap API:', function () {

  describe('GET /api/clientPaymentMaps', function () {
    var clientPaymentMaps;

    beforeEach(function (done) {
      request(app)
        .get('/api/clientPaymentMaps')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          clientPaymentMaps = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      clientPaymentMaps.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/clientPaymentMaps', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/clientPaymentMaps')
        .send({
          name: 'New ClientPaymentMap',
          info: 'This is the brand new clientPaymentMap!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newClientPaymentMap = res.body;
          done();
        });
    });

    it('should respond with the newly created clientPaymentMap', function () {
      newClientPaymentMap.name.should.equal('New ClientPaymentMap');
      newClientPaymentMap.info.should.equal('This is the brand new clientPaymentMap!!!');
    });

  });

  describe('GET /api/clientPaymentMaps/:id', function () {
    var clientPaymentMap;

    beforeEach(function (done) {
      request(app)
        .get('/api/clientPaymentMaps/' + newClientPaymentMap._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          clientPaymentMap = res.body;
          done();
        });
    });

    afterEach(function () {
      clientPaymentMap = {};
    });

    it('should respond with the requested clientPaymentMap', function () {
      clientPaymentMap.name.should.equal('New ClientPaymentMap');
      clientPaymentMap.info.should.equal('This is the brand new clientPaymentMap!!!');
    });

  });

  describe('PUT /api/clientPaymentMaps/:id', function () {
    var updatedClientPaymentMap;

    beforeEach(function (done) {
      request(app)
        .put('/api/clientPaymentMaps/' + newClientPaymentMap._id)
        .send({
          name: 'Updated ClientPaymentMap',
          info: 'This is the updated clientPaymentMap!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedClientPaymentMap = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedClientPaymentMap = {};
    });

    it('should respond with the updated clientPaymentMap', function () {
      updatedClientPaymentMap.name.should.equal('Updated ClientPaymentMap');
      updatedClientPaymentMap.info.should.equal('This is the updated clientPaymentMap!!!');
    });

  });

  describe('DELETE /api/clientPaymentMaps/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/clientPaymentMaps/' + newClientPaymentMap._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when clientPaymentMap does not exist', function (done) {
      request(app)
        .delete('/api/clientPaymentMaps/' + newClientPaymentMap._id)
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
