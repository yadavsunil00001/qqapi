'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobsInstituteCtrlStub = {
  index: 'jobsInstituteCtrl.index',
  show: 'jobsInstituteCtrl.show',
  create: 'jobsInstituteCtrl.create',
  update: 'jobsInstituteCtrl.update',
  destroy: 'jobsInstituteCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var jobsInstituteIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './jobsInstitute.controller': jobsInstituteCtrlStub,
});

describe('JobsInstitute API Router:', function () {

  it('should return an express router instance', function () {
    jobsInstituteIndex.should.equal(routerStub);
  });

  describe('GET /api/jobsInstitutes', function () {

    it('should route to jobsInstitute.controller.index', function () {
      routerStub.get
        .withArgs('/', 'jobsInstituteCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobsInstitutes/:id', function () {

    it('should route to jobsInstitute.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'jobsInstituteCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobsInstitutes', function () {

    it('should route to jobsInstitute.controller.create', function () {
      routerStub.post
        .withArgs('/', 'jobsInstituteCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobsInstitutes/:id', function () {

    it('should route to jobsInstitute.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'jobsInstituteCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobsInstitutes/:id', function () {

    it('should route to jobsInstitute.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'jobsInstituteCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobsInstitutes/:id', function () {

    it('should route to jobsInstitute.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'jobsInstituteCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
