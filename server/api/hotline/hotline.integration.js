'use strict';

var app = require('../..');
import request from 'supertest';

var newHotline;

describe('Hotline API:', function() {

  describe('GET /api/hotlines', function() {
    var hotlines;

    beforeEach(function(done) {
      request(app)
        .get('/api/hotlines')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          hotlines = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      hotlines.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/hotlines', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/hotlines')
        .send({
          name: 'New Hotline',
          info: 'This is the brand new hotline!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newHotline = res.body;
          done();
        });
    });

    it('should respond with the newly created hotline', function() {
      newHotline.name.should.equal('New Hotline');
      newHotline.info.should.equal('This is the brand new hotline!!!');
    });

  });

  describe('GET /api/hotlines/:id', function() {
    var hotline;

    beforeEach(function(done) {
      request(app)
        .get('/api/hotlines/' + newHotline._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          hotline = res.body;
          done();
        });
    });

    afterEach(function() {
      hotline = {};
    });

    it('should respond with the requested hotline', function() {
      hotline.name.should.equal('New Hotline');
      hotline.info.should.equal('This is the brand new hotline!!!');
    });

  });

  describe('PUT /api/hotlines/:id', function() {
    var updatedHotline;

    beforeEach(function(done) {
      request(app)
        .put('/api/hotlines/' + newHotline._id)
        .send({
          name: 'Updated Hotline',
          info: 'This is the updated hotline!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedHotline = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedHotline = {};
    });

    it('should respond with the updated hotline', function() {
      updatedHotline.name.should.equal('Updated Hotline');
      updatedHotline.info.should.equal('This is the updated hotline!!!');
    });

  });

  describe('DELETE /api/hotlines/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/hotlines/' + newHotline._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when hotline does not exist', function(done) {
      request(app)
        .delete('/api/hotlines/' + newHotline._id)
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
