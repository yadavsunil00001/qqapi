'use strict';

var app = require('../..');
import request from 'supertest';

var newScreeningState;

describe('ScreeningState API:', function() {

  describe('GET /api/screeningStates', function() {
    var screeningStates;

    beforeEach(function(done) {
      request(app)
        .get('/api/screeningStates')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          screeningStates = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      screeningStates.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/screeningStates', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/screeningStates')
        .send({
          name: 'New ScreeningState',
          info: 'This is the brand new screeningState!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newScreeningState = res.body;
          done();
        });
    });

    it('should respond with the newly created screeningState', function() {
      newScreeningState.name.should.equal('New ScreeningState');
      newScreeningState.info.should.equal('This is the brand new screeningState!!!');
    });

  });

  describe('GET /api/screeningStates/:id', function() {
    var screeningState;

    beforeEach(function(done) {
      request(app)
        .get('/api/screeningStates/' + newScreeningState._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          screeningState = res.body;
          done();
        });
    });

    afterEach(function() {
      screeningState = {};
    });

    it('should respond with the requested screeningState', function() {
      screeningState.name.should.equal('New ScreeningState');
      screeningState.info.should.equal('This is the brand new screeningState!!!');
    });

  });

  describe('PUT /api/screeningStates/:id', function() {
    var updatedScreeningState;

    beforeEach(function(done) {
      request(app)
        .put('/api/screeningStates/' + newScreeningState._id)
        .send({
          name: 'Updated ScreeningState',
          info: 'This is the updated screeningState!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedScreeningState = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedScreeningState = {};
    });

    it('should respond with the updated screeningState', function() {
      updatedScreeningState.name.should.equal('Updated ScreeningState');
      updatedScreeningState.info.should.equal('This is the updated screeningState!!!');
    });

  });

  describe('DELETE /api/screeningStates/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/screeningStates/' + newScreeningState._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when screeningState does not exist', function(done) {
      request(app)
        .delete('/api/screeningStates/' + newScreeningState._id)
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
