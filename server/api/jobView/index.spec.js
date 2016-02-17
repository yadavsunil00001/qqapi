'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobViewCtrlStub = {
  index: 'jobViewCtrl.index',
  show: 'jobViewCtrl.show',
  create: 'jobViewCtrl.create',
  update: 'jobViewCtrl.update',
  destroy: 'jobViewCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var jobViewIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './jobView.controller': jobViewCtrlStub
});

describe('JobView API Router:', function() {

  it('should return an express router instance', function() {
    jobViewIndex.should.equal(routerStub);
  });

  describe('GET /api/jobViews', function() {

    it('should route to jobView.controller.index', function() {
      routerStub.get
        .withArgs('/', 'jobViewCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobViews/:id', function() {

    it('should route to jobView.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'jobViewCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobViews', function() {

    it('should route to jobView.controller.create', function() {
      routerStub.post
        .withArgs('/', 'jobViewCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobViews/:id', function() {

    it('should route to jobView.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'jobViewCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobViews/:id', function() {

    it('should route to jobView.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'jobViewCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobViews/:id', function() {

    it('should route to jobView.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'jobViewCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
