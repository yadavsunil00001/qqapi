'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var resumeCtrlStub = {
  index: 'resumeCtrl.index',
  show: 'resumeCtrl.show',
  create: 'resumeCtrl.create',
  update: 'resumeCtrl.update',
  destroy: 'resumeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var resumeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './resume.controller': resumeCtrlStub
});

describe('Resume API Router:', function() {

  it('should return an express router instance', function() {
    resumeIndex.should.equal(routerStub);
  });

  describe('GET /api/resumes', function() {

    it('should route to resume.controller.index', function() {
      routerStub.get
        .withArgs('/', 'resumeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/resumes/:id', function() {

    it('should route to resume.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'resumeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/resumes', function() {

    it('should route to resume.controller.create', function() {
      routerStub.post
        .withArgs('/', 'resumeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/resumes/:id', function() {

    it('should route to resume.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'resumeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/resumes/:id', function() {

    it('should route to resume.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'resumeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/resumes/:id', function() {

    it('should route to resume.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'resumeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
