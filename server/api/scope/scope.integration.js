'use strict';

var app = require('../..');
import request from 'supertest';

var newScope;

describe('Scope API:', function () {

  describe('GET /api/scopes', function () {
    var scopes;

    beforeEach(function (done) {
      request(app)
        .get('/api/scopes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          scopes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      scopes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/scopes', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/scopes')
        .send({
          name: 'New Scope',
          info: 'This is the brand new scope!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newScope = res.body;
          done();
        });
    });

    it('should respond with the newly created scope', function () {
      newScope.name.should.equal('New Scope');
      newScope.info.should.equal('This is the brand new scope!!!');
    });

  });

  describe('GET /api/scopes/:id', function () {
    var scope;

    beforeEach(function (done) {
      request(app)
        .get('/api/scopes/' + newScope._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          scope = res.body;
          done();
        });
    });

    afterEach(function () {
      scope = {};
    });

    it('should respond with the requested scope', function () {
      scope.name.should.equal('New Scope');
      scope.info.should.equal('This is the brand new scope!!!');
    });

  });

  describe('PUT /api/scopes/:id', function () {
    var updatedScope;

    beforeEach(function (done) {
      request(app)
        .put('/api/scopes/' + newScope._id)
        .send({
          name: 'Updated Scope',
          info: 'This is the updated scope!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedScope = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedScope = {};
    });

    it('should respond with the updated scope', function () {
      updatedScope.name.should.equal('Updated Scope');
      updatedScope.info.should.equal('This is the updated scope!!!');
    });

  });

  describe('DELETE /api/scopes/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/scopes/' + newScope._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when scope does not exist', function (done) {
      request(app)
        .delete('/api/scopes/' + newScope._id)
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
