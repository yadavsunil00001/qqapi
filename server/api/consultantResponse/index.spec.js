'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var consultantResponseCtrlStub = {
  index: 'consultantResponseCtrl.index',
  show: 'consultantResponseCtrl.show',
  create: 'consultantResponseCtrl.create',
  update: 'consultantResponseCtrl.update',
  destroy: 'consultantResponseCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var consultantResponseIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './consultantResponse.controller': consultantResponseCtrlStub
});

describe('ConsultantResponse API Router:', function() {

  it('should return an express router instance', function() {
    consultantResponseIndex.should.equal(routerStub);
  });

  describe('GET /api/consultantResponses', function() {

    it('should route to consultantResponse.controller.index', function() {
      routerStub.get
        .withArgs('/', 'consultantResponseCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/consultantResponses/:id', function() {

    it('should route to consultantResponse.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'consultantResponseCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/consultantResponses', function() {

    it('should route to consultantResponse.controller.create', function() {
      routerStub.post
        .withArgs('/', 'consultantResponseCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/consultantResponses/:id', function() {

    it('should route to consultantResponse.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'consultantResponseCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/consultantResponses/:id', function() {

    it('should route to consultantResponse.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'consultantResponseCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/consultantResponses/:id', function() {

    it('should route to consultantResponse.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'consultantResponseCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
