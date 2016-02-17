'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var applicantSkillCtrlStub = {
  index: 'applicantSkillCtrl.index',
  show: 'applicantSkillCtrl.show',
  create: 'applicantSkillCtrl.create',
  update: 'applicantSkillCtrl.update',
  destroy: 'applicantSkillCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var applicantSkillIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './applicantSkill.controller': applicantSkillCtrlStub
});

describe('ApplicantSkill API Router:', function() {

  it('should return an express router instance', function() {
    applicantSkillIndex.should.equal(routerStub);
  });

  describe('GET /api/applicantSkills', function() {

    it('should route to applicantSkill.controller.index', function() {
      routerStub.get
        .withArgs('/', 'applicantSkillCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/applicantSkills/:id', function() {

    it('should route to applicantSkill.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'applicantSkillCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/applicantSkills', function() {

    it('should route to applicantSkill.controller.create', function() {
      routerStub.post
        .withArgs('/', 'applicantSkillCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/applicantSkills/:id', function() {

    it('should route to applicantSkill.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'applicantSkillCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/applicantSkills/:id', function() {

    it('should route to applicantSkill.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'applicantSkillCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/applicantSkills/:id', function() {

    it('should route to applicantSkill.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'applicantSkillCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
