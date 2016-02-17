'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var queuedTaskCtrlStub = {
  index: 'queuedTaskCtrl.index',
  show: 'queuedTaskCtrl.show',
  create: 'queuedTaskCtrl.create',
  update: 'queuedTaskCtrl.update',
  destroy: 'queuedTaskCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var queuedTaskIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './queuedTask.controller': queuedTaskCtrlStub
});

describe('QueuedTask API Router:', function() {

  it('should return an express router instance', function() {
    queuedTaskIndex.should.equal(routerStub);
  });

  describe('GET /api/queuedTasks', function() {

    it('should route to queuedTask.controller.index', function() {
      routerStub.get
        .withArgs('/', 'queuedTaskCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/queuedTasks/:id', function() {

    it('should route to queuedTask.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'queuedTaskCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/queuedTasks', function() {

    it('should route to queuedTask.controller.create', function() {
      routerStub.post
        .withArgs('/', 'queuedTaskCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/queuedTasks/:id', function() {

    it('should route to queuedTask.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'queuedTaskCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/queuedTasks/:id', function() {

    it('should route to queuedTask.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'queuedTaskCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/queuedTasks/:id', function() {

    it('should route to queuedTask.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'queuedTaskCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
