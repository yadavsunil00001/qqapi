

var app = require('../..');
import request from 'supertest';

var newFollowerType;

describe('FollowerType API:', function () {

  describe('GET /api/followerTypes', function () {
    var followerTypes;

    beforeEach(function (done) {
      request(app)
        .get('/api/followerTypes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          followerTypes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      followerTypes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/followerTypes', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/followerTypes')
        .send({
          name: 'New FollowerType',
          info: 'This is the brand new followerType!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newFollowerType = res.body;
          done();
        });
    });

    it('should respond with the newly created followerType', function () {
      newFollowerType.name.should.equal('New FollowerType');
      newFollowerType.info.should.equal('This is the brand new followerType!!!');
    });

  });

  describe('GET /api/followerTypes/:id', function () {
    var followerType;

    beforeEach(function (done) {
      request(app)
        .get('/api/followerTypes/' + newFollowerType._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          followerType = res.body;
          done();
        });
    });

    afterEach(function () {
      followerType = {};
    });

    it('should respond with the requested followerType', function () {
      followerType.name.should.equal('New FollowerType');
      followerType.info.should.equal('This is the brand new followerType!!!');
    });

  });

  describe('PUT /api/followerTypes/:id', function () {
    var updatedFollowerType;

    beforeEach(function (done) {
      request(app)
        .put('/api/followerTypes/' + newFollowerType._id)
        .send({
          name: 'Updated FollowerType',
          info: 'This is the updated followerType!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedFollowerType = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedFollowerType = {};
    });

    it('should respond with the updated followerType', function () {
      updatedFollowerType.name.should.equal('Updated FollowerType');
      updatedFollowerType.info.should.equal('This is the updated followerType!!!');
    });

  });

  describe('DELETE /api/followerTypes/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/followerTypes/' + newFollowerType._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when followerType does not exist', function (done) {
      request(app)
        .delete('/api/followerTypes/' + newFollowerType._id)
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
