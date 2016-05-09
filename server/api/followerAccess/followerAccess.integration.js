'use strict';

var app = require('../..');
import request from 'supertest';

var newFollowerAccess;

describe('FollowerAccess API:', function () {

  describe('GET /api/followerAccess', function () {
    var followerAccesss;

    beforeEach(function (done) {
      request(app)
        .get('/api/followerAccess')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          followerAccesss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      followerAccesss.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/followerAccess', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/followerAccess')
        .send({
          name: 'New FollowerAccess',
          info: 'This is the brand new followerAccess!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newFollowerAccess = res.body;
          done();
        });
    });

    it('should respond with the newly created followerAccess', function () {
      newFollowerAccess.name.should.equal('New FollowerAccess');
      newFollowerAccess.info.should.equal('This is the brand new followerAccess!!!');
    });

  });

  describe('GET /api/followerAccess/:id', function () {
    var followerAccess;

    beforeEach(function (done) {
      request(app)
        .get('/api/followerAccess/' + newFollowerAccess._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          followerAccess = res.body;
          done();
        });
    });

    afterEach(function () {
      followerAccess = {};
    });

    it('should respond with the requested followerAccess', function () {
      followerAccess.name.should.equal('New FollowerAccess');
      followerAccess.info.should.equal('This is the brand new followerAccess!!!');
    });

  });

  describe('PUT /api/followerAccess/:id', function () {
    var updatedFollowerAccess;

    beforeEach(function (done) {
      request(app)
        .put('/api/followerAccess/' + newFollowerAccess._id)
        .send({
          name: 'Updated FollowerAccess',
          info: 'This is the updated followerAccess!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedFollowerAccess = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedFollowerAccess = {};
    });

    it('should respond with the updated followerAccess', function () {
      updatedFollowerAccess.name.should.equal('Updated FollowerAccess');
      updatedFollowerAccess.info.should.equal('This is the updated followerAccess!!!');
    });

  });

  describe('DELETE /api/followerAccess/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/followerAccess/' + newFollowerAccess._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when followerAccess does not exist', function (done) {
      request(app)
        .delete('/api/followerAccess/' + newFollowerAccess._id)
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
