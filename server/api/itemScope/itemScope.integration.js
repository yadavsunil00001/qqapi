'use strict';

var app = require('../..');
import request from 'supertest';

var newItemScope;

describe('ItemScope API:', function () {

  describe('GET /api/itemScopes', function () {
    var itemScopes;

    beforeEach(function (done) {
      request(app)
        .get('/api/itemScopes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          itemScopes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      itemScopes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/itemScopes', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/itemScopes')
        .send({
          name: 'New ItemScope',
          info: 'This is the brand new itemScope!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newItemScope = res.body;
          done();
        });
    });

    it('should respond with the newly created itemScope', function () {
      newItemScope.name.should.equal('New ItemScope');
      newItemScope.info.should.equal('This is the brand new itemScope!!!');
    });

  });

  describe('GET /api/itemScopes/:id', function () {
    var itemScope;

    beforeEach(function (done) {
      request(app)
        .get('/api/itemScopes/' + newItemScope._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          itemScope = res.body;
          done();
        });
    });

    afterEach(function () {
      itemScope = {};
    });

    it('should respond with the requested itemScope', function () {
      itemScope.name.should.equal('New ItemScope');
      itemScope.info.should.equal('This is the brand new itemScope!!!');
    });

  });

  describe('PUT /api/itemScopes/:id', function () {
    var updatedItemScope;

    beforeEach(function (done) {
      request(app)
        .put('/api/itemScopes/' + newItemScope._id)
        .send({
          name: 'Updated ItemScope',
          info: 'This is the updated itemScope!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedItemScope = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedItemScope = {};
    });

    it('should respond with the updated itemScope', function () {
      updatedItemScope.name.should.equal('Updated ItemScope');
      updatedItemScope.info.should.equal('This is the updated itemScope!!!');
    });

  });

  describe('DELETE /api/itemScopes/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/itemScopes/' + newItemScope._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when itemScope does not exist', function (done) {
      request(app)
        .delete('/api/itemScopes/' + newItemScope._id)
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
