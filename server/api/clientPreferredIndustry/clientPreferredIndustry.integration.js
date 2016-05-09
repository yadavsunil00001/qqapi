

var app = require('../..');
import request from 'supertest';

var newClientPreferredIndustry;

describe('ClientPreferredIndustry API:', function () {

  describe('GET /api/clientPreferredIndustries', function () {
    var clientPreferredIndustrys;

    beforeEach(function (done) {
      request(app)
        .get('/api/clientPreferredIndustries')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          clientPreferredIndustrys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      clientPreferredIndustrys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/clientPreferredIndustries', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/clientPreferredIndustries')
        .send({
          name: 'New ClientPreferredIndustry',
          info: 'This is the brand new clientPreferredIndustry!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newClientPreferredIndustry = res.body;
          done();
        });
    });

    it('should respond with the newly created clientPreferredIndustry', function () {
      newClientPreferredIndustry.name.should.equal('New ClientPreferredIndustry');
      newClientPreferredIndustry.info.should.equal('This is the brand new clientPreferredIndustry!!!');
    });

  });

  describe('GET /api/clientPreferredIndustries/:id', function () {
    var clientPreferredIndustry;

    beforeEach(function (done) {
      request(app)
        .get('/api/clientPreferredIndustries/' + newClientPreferredIndustry._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          clientPreferredIndustry = res.body;
          done();
        });
    });

    afterEach(function () {
      clientPreferredIndustry = {};
    });

    it('should respond with the requested clientPreferredIndustry', function () {
      clientPreferredIndustry.name.should.equal('New ClientPreferredIndustry');
      clientPreferredIndustry.info.should.equal('This is the brand new clientPreferredIndustry!!!');
    });

  });

  describe('PUT /api/clientPreferredIndustries/:id', function () {
    var updatedClientPreferredIndustry;

    beforeEach(function (done) {
      request(app)
        .put('/api/clientPreferredIndustries/' + newClientPreferredIndustry._id)
        .send({
          name: 'Updated ClientPreferredIndustry',
          info: 'This is the updated clientPreferredIndustry!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedClientPreferredIndustry = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedClientPreferredIndustry = {};
    });

    it('should respond with the updated clientPreferredIndustry', function () {
      updatedClientPreferredIndustry.name.should.equal('Updated ClientPreferredIndustry');
      updatedClientPreferredIndustry.info.should.equal('This is the updated clientPreferredIndustry!!!');
    });

  });

  describe('DELETE /api/clientPreferredIndustries/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/clientPreferredIndustries/' + newClientPreferredIndustry._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when clientPreferredIndustry does not exist', function (done) {
      request(app)
        .delete('/api/clientPreferredIndustries/' + newClientPreferredIndustry._id)
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
