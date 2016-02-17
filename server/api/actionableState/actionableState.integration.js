'use strict';

var app = require('../..');
import request from 'supertest';

var newActionableState;

describe('ActionableState API:', function() {

  describe('GET /api/actionableStates', function() {
    var actionableStates;

    beforeEach(function(done) {
      request(app)
        .get('/api/actionableStates')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          actionableStates = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      actionableStates.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/actionableStates', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/actionableStates')
        .send({
          name: 'New ActionableState',
          info: 'This is the brand new actionableState!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newActionableState = res.body;
          done();
        });
    });

    it('should respond with the newly created actionableState', function() {
      newActionableState.name.should.equal('New ActionableState');
      newActionableState.info.should.equal('This is the brand new actionableState!!!');
    });

  });

  describe('GET /api/actionableStates/:id', function() {
    var actionableState;

    beforeEach(function(done) {
      request(app)
        .get('/api/actionableStates/' + newActionableState._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          actionableState = res.body;
          done();
        });
    });

    afterEach(function() {
      actionableState = {};
    });

    it('should respond with the requested actionableState', function() {
      actionableState.name.should.equal('New ActionableState');
      actionableState.info.should.equal('This is the brand new actionableState!!!');
    });

  });

  describe('PUT /api/actionableStates/:id', function() {
    var updatedActionableState;

    beforeEach(function(done) {
      request(app)
        .put('/api/actionableStates/' + newActionableState._id)
        .send({
          name: 'Updated ActionableState',
          info: 'This is the updated actionableState!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedActionableState = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedActionableState = {};
    });

    it('should respond with the updated actionableState', function() {
      updatedActionableState.name.should.equal('Updated ActionableState');
      updatedActionableState.info.should.equal('This is the updated actionableState!!!');
    });

  });

  describe('DELETE /api/actionableStates/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/actionableStates/' + newActionableState._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when actionableState does not exist', function(done) {
      request(app)
        .delete('/api/actionableStates/' + newActionableState._id)
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
