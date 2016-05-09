'use strict';

var app = require('../..');
import request from 'supertest';

var newWelcome;

describe('Welcome API:', function () {

  describe('GET /api/welcomes', function () {
    var welcomes;

    beforeEach(function (done) {
      request(app)
        .get('/api/welcomes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          welcomes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      welcomes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/welcomes', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/welcomes')
        .send({
          name: 'New Welcome',
          info: 'This is the brand new welcome!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newWelcome = res.body;
          done();
        });
    });

    it('should respond with the newly created welcome', function () {
      newWelcome.name.should.equal('New Welcome');
      newWelcome.info.should.equal('This is the brand new welcome!!!');
    });

  });

  describe('GET /api/welcomes/:id', function () {
    var welcome;

    beforeEach(function (done) {
      request(app)
        .get('/api/welcomes/' + newWelcome._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          welcome = res.body;
          done();
        });
    });

    afterEach(function () {
      welcome = {};
    });

    it('should respond with the requested welcome', function () {
      welcome.name.should.equal('New Welcome');
      welcome.info.should.equal('This is the brand new welcome!!!');
    });

  });

  describe('PUT /api/welcomes/:id', function () {
    var updatedWelcome;

    beforeEach(function (done) {
      request(app)
        .put('/api/welcomes/' + newWelcome._id)
        .send({
          name: 'Updated Welcome',
          info: 'This is the updated welcome!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedWelcome = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedWelcome = {};
    });

    it('should respond with the updated welcome', function () {
      updatedWelcome.name.should.equal('Updated Welcome');
      updatedWelcome.info.should.equal('This is the updated welcome!!!');
    });

  });

  describe('DELETE /api/welcomes/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/welcomes/' + newWelcome._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when welcome does not exist', function (done) {
      request(app)
        .delete('/api/welcomes/' + newWelcome._id)
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
