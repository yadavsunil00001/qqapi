'use strict';

var app = require('../..');
import request from 'supertest';

var newSkill;

describe('Skill API:', function() {

  describe('GET /api/skills', function() {
    var skills;

    beforeEach(function(done) {
      request(app)
        .get('/api/skills')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          skills = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      skills.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/skills', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/skills')
        .send({
          name: 'New Skill',
          info: 'This is the brand new skill!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newSkill = res.body;
          done();
        });
    });

    it('should respond with the newly created skill', function() {
      newSkill.name.should.equal('New Skill');
      newSkill.info.should.equal('This is the brand new skill!!!');
    });

  });

  describe('GET /api/skills/:id', function() {
    var skill;

    beforeEach(function(done) {
      request(app)
        .get('/api/skills/' + newSkill._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          skill = res.body;
          done();
        });
    });

    afterEach(function() {
      skill = {};
    });

    it('should respond with the requested skill', function() {
      skill.name.should.equal('New Skill');
      skill.info.should.equal('This is the brand new skill!!!');
    });

  });

  describe('PUT /api/skills/:id', function() {
    var updatedSkill;

    beforeEach(function(done) {
      request(app)
        .put('/api/skills/' + newSkill._id)
        .send({
          name: 'Updated Skill',
          info: 'This is the updated skill!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedSkill = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSkill = {};
    });

    it('should respond with the updated skill', function() {
      updatedSkill.name.should.equal('Updated Skill');
      updatedSkill.info.should.equal('This is the updated skill!!!');
    });

  });

  describe('DELETE /api/skills/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/skills/' + newSkill._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when skill does not exist', function(done) {
      request(app)
        .delete('/api/skills/' + newSkill._id)
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
