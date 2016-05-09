'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var scopeCtrlStub = {
  index: 'scopeCtrl.index',
  show: 'scopeCtrl.show',
  create: 'scopeCtrl.create',
  update: 'scopeCtrl.update',
  destroy: 'scopeCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var scopeIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './scope.controller': scopeCtrlStub,
});

describe('Scope API Router:', function () {

  it('should return an express router instance', function () {
    scopeIndex.should.equal(routerStub);
  });

  describe('GET /api/scopes', function () {

    it('should route to scope.controller.index', function () {
      routerStub.get
        .withArgs('/', 'scopeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/scopes/:id', function () {

    it('should route to scope.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'scopeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/scopes', function () {

    it('should route to scope.controller.create', function () {
      routerStub.post
        .withArgs('/', 'scopeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/scopes/:id', function () {

    it('should route to scope.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'scopeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/scopes/:id', function () {

    it('should route to scope.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'scopeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/scopes/:id', function () {

    it('should route to scope.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'scopeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
