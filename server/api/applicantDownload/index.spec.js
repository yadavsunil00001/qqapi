'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var applicantDownloadCtrlStub = {
  index: 'applicantDownloadCtrl.index',
  show: 'applicantDownloadCtrl.show',
  create: 'applicantDownloadCtrl.create',
  update: 'applicantDownloadCtrl.update',
  destroy: 'applicantDownloadCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var applicantDownloadIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './applicantDownload.controller': applicantDownloadCtrlStub,
});

describe('ApplicantDownload API Router:', function () {

  it('should return an express router instance', function () {
    applicantDownloadIndex.should.equal(routerStub);
  });

  describe('GET /api/applicantDownloads', function () {

    it('should route to applicantDownload.controller.index', function () {
      routerStub.get
        .withArgs('/', 'applicantDownloadCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/applicantDownloads/:id', function () {

    it('should route to applicantDownload.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'applicantDownloadCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/applicantDownloads', function () {

    it('should route to applicantDownload.controller.create', function () {
      routerStub.post
        .withArgs('/', 'applicantDownloadCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/applicantDownloads/:id', function () {

    it('should route to applicantDownload.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'applicantDownloadCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/applicantDownloads/:id', function () {

    it('should route to applicantDownload.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'applicantDownloadCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/applicantDownloads/:id', function () {

    it('should route to applicantDownload.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'applicantDownloadCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
