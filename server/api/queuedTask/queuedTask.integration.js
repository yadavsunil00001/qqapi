'use strict';

var app = require('../..');
import request from 'supertest';

var newQueuedTask;

describe('QueuedTask API:', function () {

  describe('GET /api/queuedTasks', function () {
    var queuedTasks;

    beforeEach(function (done) {
      request(app)
        .get('/api/queuedTasks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          queuedTasks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      queuedTasks.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/queuedTasks', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/queuedTasks')
        .send({
          name: 'New QueuedTask',
          info: 'This is the brand new queuedTask!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newQueuedTask = res.body;
          done();
        });
    });

    it('should respond with the newly created queuedTask', function () {
      newQueuedTask.name.should.equal('New QueuedTask');
      newQueuedTask.info.should.equal('This is the brand new queuedTask!!!');
    });

  });

  describe('GET /api/queuedTasks/:id', function () {
    var queuedTask;

    beforeEach(function (done) {
      request(app)
        .get('/api/queuedTasks/' + newQueuedTask._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          queuedTask = res.body;
          done();
        });
    });

    afterEach(function () {
      queuedTask = {};
    });

    it('should respond with the requested queuedTask', function () {
      queuedTask.name.should.equal('New QueuedTask');
      queuedTask.info.should.equal('This is the brand new queuedTask!!!');
    });

  });

  describe('PUT /api/queuedTasks/:id', function () {
    var updatedQueuedTask;

    beforeEach(function (done) {
      request(app)
        .put('/api/queuedTasks/' + newQueuedTask._id)
        .send({
          name: 'Updated QueuedTask',
          info: 'This is the updated queuedTask!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedQueuedTask = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedQueuedTask = {};
    });

    it('should respond with the updated queuedTask', function () {
      updatedQueuedTask.name.should.equal('Updated QueuedTask');
      updatedQueuedTask.info.should.equal('This is the updated queuedTask!!!');
    });

  });

  describe('DELETE /api/queuedTasks/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/queuedTasks/' + newQueuedTask._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when queuedTask does not exist', function (done) {
      request(app)
        .delete('/api/queuedTasks/' + newQueuedTask._id)
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
