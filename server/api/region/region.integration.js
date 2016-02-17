'use strict';

var app = require('../..');
import request from 'supertest';

var newRegion;

describe('Region API:', function() {

  describe('GET /api/regions', function() {
    var regions;

    beforeEach(function(done) {
      request(app)
        .get('/api/regions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          regions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      regions.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/regions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/regions')
        .send({
          name: 'New Region',
          info: 'This is the brand new region!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newRegion = res.body;
          done();
        });
    });

    it('should respond with the newly created region', function() {
      newRegion.name.should.equal('New Region');
      newRegion.info.should.equal('This is the brand new region!!!');
    });

  });

  describe('GET /api/regions/:id', function() {
    var region;

    beforeEach(function(done) {
      request(app)
        .get('/api/regions/' + newRegion._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          region = res.body;
          done();
        });
    });

    afterEach(function() {
      region = {};
    });

    it('should respond with the requested region', function() {
      region.name.should.equal('New Region');
      region.info.should.equal('This is the brand new region!!!');
    });

  });

  describe('PUT /api/regions/:id', function() {
    var updatedRegion;

    beforeEach(function(done) {
      request(app)
        .put('/api/regions/' + newRegion._id)
        .send({
          name: 'Updated Region',
          info: 'This is the updated region!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedRegion = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRegion = {};
    });

    it('should respond with the updated region', function() {
      updatedRegion.name.should.equal('Updated Region');
      updatedRegion.info.should.equal('This is the updated region!!!');
    });

  });

  describe('DELETE /api/regions/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/regions/' + newRegion._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when region does not exist', function(done) {
      request(app)
        .delete('/api/regions/' + newRegion._id)
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
