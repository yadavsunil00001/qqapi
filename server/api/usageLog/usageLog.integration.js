

var app = require('../..');
import request from 'supertest';

var newUsageLog;

describe('UsageLog API:', function () {

  describe('GET /api/usageLogs', function () {
    var usageLogs;

    beforeEach(function (done) {
      request(app)
        .get('/api/usageLogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          usageLogs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      usageLogs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/usageLogs', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/usageLogs')
        .send({
          name: 'New UsageLog',
          info: 'This is the brand new usageLog!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newUsageLog = res.body;
          done();
        });
    });

    it('should respond with the newly created usageLog', function () {
      newUsageLog.name.should.equal('New UsageLog');
      newUsageLog.info.should.equal('This is the brand new usageLog!!!');
    });

  });

  describe('GET /api/usageLogs/:id', function () {
    var usageLog;

    beforeEach(function (done) {
      request(app)
        .get('/api/usageLogs/' + newUsageLog._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          usageLog = res.body;
          done();
        });
    });

    afterEach(function () {
      usageLog = {};
    });

    it('should respond with the requested usageLog', function () {
      usageLog.name.should.equal('New UsageLog');
      usageLog.info.should.equal('This is the brand new usageLog!!!');
    });

  });

  describe('PUT /api/usageLogs/:id', function () {
    var updatedUsageLog;

    beforeEach(function (done) {
      request(app)
        .put('/api/usageLogs/' + newUsageLog._id)
        .send({
          name: 'Updated UsageLog',
          info: 'This is the updated usageLog!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedUsageLog = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedUsageLog = {};
    });

    it('should respond with the updated usageLog', function () {
      updatedUsageLog.name.should.equal('Updated UsageLog');
      updatedUsageLog.info.should.equal('This is the updated usageLog!!!');
    });

  });

  describe('DELETE /api/usageLogs/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/usageLogs/' + newUsageLog._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when usageLog does not exist', function (done) {
      request(app)
        .delete('/api/usageLogs/' + newUsageLog._id)
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
