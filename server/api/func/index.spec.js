'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var funcCtrlStub = {
  index: 'funcCtrl.index',
  show: 'funcCtrl.show',
  create: 'funcCtrl.create',
  update: 'funcCtrl.update',
  destroy: 'funcCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var funcIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './func.controller': funcCtrlStub
});

describe('Func API Router:', function() {

  it('should return an express router instance', function() {
    funcIndex.should.equal(routerStub);
  });

  describe('GET /api/funcs', function() {

    it('should route to func.controller.index', function() {
      routerStub.get
        .withArgs('/', 'funcCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/funcs/:id', function() {

    it('should route to func.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'funcCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/funcs', function() {

    it('should route to func.controller.create', function() {
      routerStub.post
        .withArgs('/', 'funcCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/funcs/:id', function() {

    it('should route to func.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'funcCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/funcs/:id', function() {

    it('should route to func.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'funcCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/funcs/:id', function() {

    it('should route to func.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'funcCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
