'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobStatusCtrlStub = {
  index: 'jobStatusCtrl.index',
  show: 'jobStatusCtrl.show',
  create: 'jobStatusCtrl.create',
  update: 'jobStatusCtrl.update',
  destroy: 'jobStatusCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var jobStatusIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './jobStatus.controller': jobStatusCtrlStub
});

describe('JobStatus API Router:', function() {

  it('should return an express router instance', function() {
    jobStatusIndex.should.equal(routerStub);
  });

  describe('GET /api/jobStatus', function() {

    it('should route to jobStatus.controller.index', function() {
      routerStub.get
        .withArgs('/', 'jobStatusCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobStatus/:id', function() {

    it('should route to jobStatus.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'jobStatusCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobStatus', function() {

    it('should route to jobStatus.controller.create', function() {
      routerStub.post
        .withArgs('/', 'jobStatusCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobStatus/:id', function() {

    it('should route to jobStatus.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'jobStatusCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobStatus/:id', function() {

    it('should route to jobStatus.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'jobStatusCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobStatus/:id', function() {

    it('should route to jobStatus.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'jobStatusCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
