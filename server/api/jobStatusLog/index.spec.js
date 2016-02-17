'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobStatusLogCtrlStub = {
  index: 'jobStatusLogCtrl.index',
  show: 'jobStatusLogCtrl.show',
  create: 'jobStatusLogCtrl.create',
  update: 'jobStatusLogCtrl.update',
  destroy: 'jobStatusLogCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var jobStatusLogIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './jobStatusLog.controller': jobStatusLogCtrlStub
});

describe('JobStatusLog API Router:', function() {

  it('should return an express router instance', function() {
    jobStatusLogIndex.should.equal(routerStub);
  });

  describe('GET /api/jobStatusLogs', function() {

    it('should route to jobStatusLog.controller.index', function() {
      routerStub.get
        .withArgs('/', 'jobStatusLogCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobStatusLogs/:id', function() {

    it('should route to jobStatusLog.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'jobStatusLogCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobStatusLogs', function() {

    it('should route to jobStatusLog.controller.create', function() {
      routerStub.post
        .withArgs('/', 'jobStatusLogCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobStatusLogs/:id', function() {

    it('should route to jobStatusLog.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'jobStatusLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobStatusLogs/:id', function() {

    it('should route to jobStatusLog.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'jobStatusLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobStatusLogs/:id', function() {

    it('should route to jobStatusLog.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'jobStatusLogCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
