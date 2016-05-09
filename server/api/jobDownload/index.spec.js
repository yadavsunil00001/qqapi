'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobDownloadCtrlStub = {
  index: 'jobDownloadCtrl.index',
  show: 'jobDownloadCtrl.show',
  create: 'jobDownloadCtrl.create',
  update: 'jobDownloadCtrl.update',
  destroy: 'jobDownloadCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var jobDownloadIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './jobDownload.controller': jobDownloadCtrlStub,
});

describe('JobDownload API Router:', function () {

  it('should return an express router instance', function () {
    jobDownloadIndex.should.equal(routerStub);
  });

  describe('GET /api/jobDownloads', function () {

    it('should route to jobDownload.controller.index', function () {
      routerStub.get
        .withArgs('/', 'jobDownloadCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobDownloads/:id', function () {

    it('should route to jobDownload.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'jobDownloadCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobDownloads', function () {

    it('should route to jobDownload.controller.create', function () {
      routerStub.post
        .withArgs('/', 'jobDownloadCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobDownloads/:id', function () {

    it('should route to jobDownload.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'jobDownloadCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobDownloads/:id', function () {

    it('should route to jobDownload.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'jobDownloadCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobDownloads/:id', function () {

    it('should route to jobDownload.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'jobDownloadCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
