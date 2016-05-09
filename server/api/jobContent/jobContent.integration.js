'use strict';

var app = require('../..');
import request from 'supertest';

var newJobContent;

describe('JobContent API:', function () {

  describe('GET /api/jobContents', function () {
    var jobContents;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobContents')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobContents = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      jobContents.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobContents', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/jobContents')
        .send({
          name: 'New JobContent',
          info: 'This is the brand new jobContent!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobContent = res.body;
          done();
        });
    });

    it('should respond with the newly created jobContent', function () {
      newJobContent.name.should.equal('New JobContent');
      newJobContent.info.should.equal('This is the brand new jobContent!!!');
    });

  });

  describe('GET /api/jobContents/:id', function () {
    var jobContent;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobContents/' + newJobContent._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobContent = res.body;
          done();
        });
    });

    afterEach(function () {
      jobContent = {};
    });

    it('should respond with the requested jobContent', function () {
      jobContent.name.should.equal('New JobContent');
      jobContent.info.should.equal('This is the brand new jobContent!!!');
    });

  });

  describe('PUT /api/jobContents/:id', function () {
    var updatedJobContent;

    beforeEach(function (done) {
      request(app)
        .put('/api/jobContents/' + newJobContent._id)
        .send({
          name: 'Updated JobContent',
          info: 'This is the updated jobContent!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedJobContent = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedJobContent = {};
    });

    it('should respond with the updated jobContent', function () {
      updatedJobContent.name.should.equal('Updated JobContent');
      updatedJobContent.info.should.equal('This is the updated jobContent!!!');
    });

  });

  describe('DELETE /api/jobContents/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/jobContents/' + newJobContent._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobContent does not exist', function (done) {
      request(app)
        .delete('/api/jobContents/' + newJobContent._id)
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
