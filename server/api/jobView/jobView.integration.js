'use strict';

var app = require('../..');
import request from 'supertest';

var newJobView;

describe('JobView API:', function() {

  describe('GET /api/jobViews', function() {
    var jobViews;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobViews')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobViews = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      jobViews.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobViews', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/jobViews')
        .send({
          name: 'New JobView',
          info: 'This is the brand new jobView!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobView = res.body;
          done();
        });
    });

    it('should respond with the newly created jobView', function() {
      newJobView.name.should.equal('New JobView');
      newJobView.info.should.equal('This is the brand new jobView!!!');
    });

  });

  describe('GET /api/jobViews/:id', function() {
    var jobView;

    beforeEach(function(done) {
      request(app)
        .get('/api/jobViews/' + newJobView._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobView = res.body;
          done();
        });
    });

    afterEach(function() {
      jobView = {};
    });

    it('should respond with the requested jobView', function() {
      jobView.name.should.equal('New JobView');
      jobView.info.should.equal('This is the brand new jobView!!!');
    });

  });

  describe('PUT /api/jobViews/:id', function() {
    var updatedJobView;

    beforeEach(function(done) {
      request(app)
        .put('/api/jobViews/' + newJobView._id)
        .send({
          name: 'Updated JobView',
          info: 'This is the updated jobView!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedJobView = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedJobView = {};
    });

    it('should respond with the updated jobView', function() {
      updatedJobView.name.should.equal('Updated JobView');
      updatedJobView.info.should.equal('This is the updated jobView!!!');
    });

  });

  describe('DELETE /api/jobViews/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/jobViews/' + newJobView._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobView does not exist', function(done) {
      request(app)
        .delete('/api/jobViews/' + newJobView._id)
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
