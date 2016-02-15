'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobAllocationCtrlStub = {
  index: 'jobAllocationCtrl.index',
  show: 'jobAllocationCtrl.show',
  create: 'jobAllocationCtrl.create',
  update: 'jobAllocationCtrl.update',
  destroy: 'jobAllocationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var jobAllocationIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './jobAllocation.controller': jobAllocationCtrlStub
});

describe('JobAllocation API Router:', function() {

  it('should return an express router instance', function() {
    jobAllocationIndex.should.equal(routerStub);
  });

  describe('GET /api/jobAllocations', function() {

    it('should route to jobAllocation.controller.index', function() {
      routerStub.get
        .withArgs('/', 'jobAllocationCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobAllocations/:id', function() {

    it('should route to jobAllocation.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'jobAllocationCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobAllocations', function() {

    it('should route to jobAllocation.controller.create', function() {
      routerStub.post
        .withArgs('/', 'jobAllocationCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobAllocations/:id', function() {

    it('should route to jobAllocation.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'jobAllocationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobAllocations/:id', function() {

    it('should route to jobAllocation.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'jobAllocationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobAllocations/:id', function() {

    it('should route to jobAllocation.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'jobAllocationCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
