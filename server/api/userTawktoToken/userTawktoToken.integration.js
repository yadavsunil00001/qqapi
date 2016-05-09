

var app = require('../..');
import request from 'supertest';

var newUserTawktoToken;

describe('UserTawktoToken API:', function () {

  describe('GET /api/userTawktoTokens', function () {
    var userTawktoTokens;

    beforeEach(function (done) {
      request(app)
        .get('/api/userTawktoTokens')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userTawktoTokens = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      userTawktoTokens.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/userTawktoTokens', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/userTawktoTokens')
        .send({
          name: 'New UserTawktoToken',
          info: 'This is the brand new userTawktoToken!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newUserTawktoToken = res.body;
          done();
        });
    });

    it('should respond with the newly created userTawktoToken', function () {
      newUserTawktoToken.name.should.equal('New UserTawktoToken');
      newUserTawktoToken.info.should.equal('This is the brand new userTawktoToken!!!');
    });

  });

  describe('GET /api/userTawktoTokens/:id', function () {
    var userTawktoToken;

    beforeEach(function (done) {
      request(app)
        .get('/api/userTawktoTokens/' + newUserTawktoToken._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userTawktoToken = res.body;
          done();
        });
    });

    afterEach(function () {
      userTawktoToken = {};
    });

    it('should respond with the requested userTawktoToken', function () {
      userTawktoToken.name.should.equal('New UserTawktoToken');
      userTawktoToken.info.should.equal('This is the brand new userTawktoToken!!!');
    });

  });

  describe('PUT /api/userTawktoTokens/:id', function () {
    var updatedUserTawktoToken;

    beforeEach(function (done) {
      request(app)
        .put('/api/userTawktoTokens/' + newUserTawktoToken._id)
        .send({
          name: 'Updated UserTawktoToken',
          info: 'This is the updated userTawktoToken!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedUserTawktoToken = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedUserTawktoToken = {};
    });

    it('should respond with the updated userTawktoToken', function () {
      updatedUserTawktoToken.name.should.equal('Updated UserTawktoToken');
      updatedUserTawktoToken.info.should.equal('This is the updated userTawktoToken!!!');
    });

  });

  describe('DELETE /api/userTawktoTokens/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/userTawktoTokens/' + newUserTawktoToken._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when userTawktoToken does not exist', function (done) {
      request(app)
        .delete('/api/userTawktoTokens/' + newUserTawktoToken._id)
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
