

var app = require('../..');
import request from 'supertest';

var newAgreement;

describe('Agreement API:', function () {

  describe('GET /api/agreements', function () {
    var agreements;

    beforeEach(function (done) {
      request(app)
        .get('/api/agreements')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          agreements = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      agreements.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/agreements', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/agreements')
        .send({
          name: 'New Agreement',
          info: 'This is the brand new agreement!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAgreement = res.body;
          done();
        });
    });

    it('should respond with the newly created agreement', function () {
      newAgreement.name.should.equal('New Agreement');
      newAgreement.info.should.equal('This is the brand new agreement!!!');
    });

  });

  describe('GET /api/agreements/:id', function () {
    var agreement;

    beforeEach(function (done) {
      request(app)
        .get('/api/agreements/' + newAgreement._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          agreement = res.body;
          done();
        });
    });

    afterEach(function () {
      agreement = {};
    });

    it('should respond with the requested agreement', function () {
      agreement.name.should.equal('New Agreement');
      agreement.info.should.equal('This is the brand new agreement!!!');
    });

  });

  describe('PUT /api/agreements/:id', function () {
    var updatedAgreement;

    beforeEach(function (done) {
      request(app)
        .put('/api/agreements/' + newAgreement._id)
        .send({
          name: 'Updated Agreement',
          info: 'This is the updated agreement!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedAgreement = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedAgreement = {};
    });

    it('should respond with the updated agreement', function () {
      updatedAgreement.name.should.equal('Updated Agreement');
      updatedAgreement.info.should.equal('This is the updated agreement!!!');
    });

  });

  describe('DELETE /api/agreements/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete('/api/agreements/' + newAgreement._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when agreement does not exist', function (done) {
      request(app)
        .delete('/api/agreements/' + newAgreement._id)
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
