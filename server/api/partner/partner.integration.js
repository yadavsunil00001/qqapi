'use strict';

var app = require('../..');
import request from 'supertest';

var newPartner;

describe('Partner API:', function() {

  describe('GET /api/partners', function() {
    var partners;

    beforeEach(function(done) {
      request(app)
        .get('/api/partners')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          partners = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      partners.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/partners', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/partners')
        .send({
          name: 'New Partner',
          info: 'This is the brand new partner!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPartner = res.body;
          done();
        });
    });

    it('should respond with the newly created partner', function() {
      newPartner.name.should.equal('New Partner');
      newPartner.info.should.equal('This is the brand new partner!!!');
    });

  });

  describe('GET /api/partners/:id', function() {
    var partner;

    beforeEach(function(done) {
      request(app)
        .get('/api/partners/' + newPartner._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          partner = res.body;
          done();
        });
    });

    afterEach(function() {
      partner = {};
    });

    it('should respond with the requested partner', function() {
      partner.name.should.equal('New Partner');
      partner.info.should.equal('This is the brand new partner!!!');
    });

  });

  describe('PUT /api/partners/:id', function() {
    var updatedPartner;

    beforeEach(function(done) {
      request(app)
        .put('/api/partners/' + newPartner._id)
        .send({
          name: 'Updated Partner',
          info: 'This is the updated partner!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPartner = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPartner = {};
    });

    it('should respond with the updated partner', function() {
      updatedPartner.name.should.equal('Updated Partner');
      updatedPartner.info.should.equal('This is the updated partner!!!');
    });

  });

  describe('DELETE /api/partners/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/partners/' + newPartner._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when partner does not exist', function(done) {
      request(app)
        .delete('/api/partners/' + newPartner._id)
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
