'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobSkillCtrlStub = {
  index: 'jobSkillCtrl.index',
  show: 'jobSkillCtrl.show',
  create: 'jobSkillCtrl.create',
  update: 'jobSkillCtrl.update',
  destroy: 'jobSkillCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var jobSkillIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './jobSkill.controller': jobSkillCtrlStub,
});

describe('JobSkill API Router:', function () {

  it('should return an express router instance', function () {
    jobSkillIndex.should.equal(routerStub);
  });

  describe('GET /api/jobSkills', function () {

    it('should route to jobSkill.controller.index', function () {
      routerStub.get
        .withArgs('/', 'jobSkillCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobSkills/:id', function () {

    it('should route to jobSkill.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'jobSkillCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobSkills', function () {

    it('should route to jobSkill.controller.create', function () {
      routerStub.post
        .withArgs('/', 'jobSkillCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobSkills/:id', function () {

    it('should route to jobSkill.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'jobSkillCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobSkills/:id', function () {

    it('should route to jobSkill.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'jobSkillCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobSkills/:id', function () {

    it('should route to jobSkill.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'jobSkillCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
