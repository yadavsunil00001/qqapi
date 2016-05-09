'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var itemScopeCtrlStub = {
  index: 'itemScopeCtrl.index',
  show: 'itemScopeCtrl.show',
  create: 'itemScopeCtrl.create',
  update: 'itemScopeCtrl.update',
  destroy: 'itemScopeCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var itemScopeIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './itemScope.controller': itemScopeCtrlStub,
});

describe('ItemScope API Router:', function () {

  it('should return an express router instance', function () {
    itemScopeIndex.should.equal(routerStub);
  });

  describe('GET /api/itemScopes', function () {

    it('should route to itemScope.controller.index', function () {
      routerStub.get
        .withArgs('/', 'itemScopeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/itemScopes/:id', function () {

    it('should route to itemScope.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'itemScopeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/itemScopes', function () {

    it('should route to itemScope.controller.create', function () {
      routerStub.post
        .withArgs('/', 'itemScopeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/itemScopes/:id', function () {

    it('should route to itemScope.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'itemScopeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/itemScopes/:id', function () {

    it('should route to itemScope.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'itemScopeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/itemScopes/:id', function () {

    it('should route to itemScope.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'itemScopeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
