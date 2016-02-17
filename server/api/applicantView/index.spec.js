'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var applicantViewCtrlStub = {
  index: 'applicantViewCtrl.index',
  show: 'applicantViewCtrl.show',
  create: 'applicantViewCtrl.create',
  update: 'applicantViewCtrl.update',
  destroy: 'applicantViewCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var applicantViewIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './applicantView.controller': applicantViewCtrlStub
});

describe('ApplicantView API Router:', function() {

  it('should return an express router instance', function() {
    applicantViewIndex.should.equal(routerStub);
  });

  describe('GET /api/applicantViews', function() {

    it('should route to applicantView.controller.index', function() {
      routerStub.get
        .withArgs('/', 'applicantViewCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/applicantViews/:id', function() {

    it('should route to applicantView.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'applicantViewCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/applicantViews', function() {

    it('should route to applicantView.controller.create', function() {
      routerStub.post
        .withArgs('/', 'applicantViewCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/applicantViews/:id', function() {

    it('should route to applicantView.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'applicantViewCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/applicantViews/:id', function() {

    it('should route to applicantView.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'applicantViewCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/applicantViews/:id', function() {

    it('should route to applicantView.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'applicantViewCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
