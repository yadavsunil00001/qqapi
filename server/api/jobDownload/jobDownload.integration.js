

var app = require('../..');
import request from 'supertest';

var newJobDownload;

describe('JobDownload API:', function () {

  describe('GET /api/jobDownloads', function () {
    var jobDownloads;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobDownloads')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobDownloads = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      jobDownloads.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/jobDownloads', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/jobDownloads')
        .send({
          name: 'New JobDownload',
          info: 'This is the brand new jobDownload!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newJobDownload = res.body;
          done();
        });
    });

    it('should respond with the newly created jobDownload', function () {
      newJobDownload.name.should.equal('New JobDownload');
      newJobDownload.info.should.equal('This is the brand new jobDownload!!!');
    });

  });

  describe('GET /api/jobDownloads/:id', function () {
    var jobDownload;

    beforeEach(function (done) {
      request(app)
        .get('/api/jobDownloads/' + newJobDownload._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          jobDownload = res.body;
          done();
        });
    });

    afterEach(function () {
      jobDownload = {};
    });

    it('should respond with the requested jobDownload', function () {
      jobDownload.name.should.equal('New JobDownload');
      jobDownload.info.should.equal('This is the brand new jobDownload!!!');
    });

  });

  describe('PUT /api/jobDownloads/:id', function () {
    var updatedJobDownload;

    beforeEach(function (done) {
      request(app)
        .put('/api/jobDownloads/' + newJobDownload._id)
        .send({
          name: 'Updated JobDownload',
          info: 'This is the updated jobDownload!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedJobDownload = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedJobDownload = {};
    });

    it('should respond with the updated jobDownload', function () {
      updatedJobDownload.name.should.equal('Updated JobDownload');
      updatedJobDownload.info.should.equal('This is the updated jobDownload!!!');
    });

  });

  describe('DELETE /api/jobDownloads/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/jobDownloads/' + newJobDownload._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when jobDownload does not exist', function (done) {
      request(app)
        .delete('/api/jobDownloads/' + newJobDownload._id)
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
