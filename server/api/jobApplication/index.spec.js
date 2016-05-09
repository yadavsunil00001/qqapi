'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobApplicationCtrlStub = {
  index: 'jobApplicationCtrl.index',
  show: 'jobApplicationCtrl.show',
  create: 'jobApplicationCtrl.create',
  update: 'jobApplicationCtrl.update',
  destroy: 'jobApplicationCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var jobApplicationIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './jobApplication.controller': jobApplicationCtrlStub,
});

describe('JobApplication API Router:', function () {

  it('should return an express router instance', function () {
    jobApplicationIndex.should.equal(routerStub);
  });

  describe('GET /api/jobApplications', function () {

    it('should route to jobApplication.controller.index', function () {
      routerStub.get
        .withArgs('/', 'jobApplicationCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobApplications/:id', function () {

    it('should route to jobApplication.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'jobApplicationCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobApplications', function () {

    it('should route to jobApplication.controller.create', function () {
      routerStub.post
        .withArgs('/', 'jobApplicationCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobApplications/:id', function () {

    it('should route to jobApplication.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'jobApplicationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobApplications/:id', function () {

    it('should route to jobApplication.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'jobApplicationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobApplications/:id', function () {

    it('should route to jobApplication.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'jobApplicationCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
