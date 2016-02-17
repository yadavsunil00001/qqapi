'use strict';

var app = require('../..');
import request from 'supertest';

var newProvince;

describe('Province API:', function() {

  describe('GET /api/provinces', function() {
    var provinces;

    beforeEach(function(done) {
      request(app)
        .get('/api/provinces')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          provinces = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      provinces.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/provinces', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/provinces')
        .send({
          name: 'New Province',
          info: 'This is the brand new province!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newProvince = res.body;
          done();
        });
    });

    it('should respond with the newly created province', function() {
      newProvince.name.should.equal('New Province');
      newProvince.info.should.equal('This is the brand new province!!!');
    });

  });

  describe('GET /api/provinces/:id', function() {
    var province;

    beforeEach(function(done) {
      request(app)
        .get('/api/provinces/' + newProvince._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          province = res.body;
          done();
        });
    });

    afterEach(function() {
      province = {};
    });

    it('should respond with the requested province', function() {
      province.name.should.equal('New Province');
      province.info.should.equal('This is the brand new province!!!');
    });

  });

  describe('PUT /api/provinces/:id', function() {
    var updatedProvince;

    beforeEach(function(done) {
      request(app)
        .put('/api/provinces/' + newProvince._id)
        .send({
          name: 'Updated Province',
          info: 'This is the updated province!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedProvince = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProvince = {};
    });

    it('should respond with the updated province', function() {
      updatedProvince.name.should.equal('Updated Province');
      updatedProvince.info.should.equal('This is the updated province!!!');
    });

  });

  describe('DELETE /api/provinces/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/provinces/' + newProvince._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when province does not exist', function(done) {
      request(app)
        .delete('/api/provinces/' + newProvince._id)
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
