'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var actionableStateCtrlStub = {
  index: 'actionableStateCtrl.index',
  show: 'actionableStateCtrl.show',
  create: 'actionableStateCtrl.create',
  update: 'actionableStateCtrl.update',
  destroy: 'actionableStateCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var actionableStateIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './actionableState.controller': actionableStateCtrlStub,
});

describe('ActionableState API Router:', function () {

  it('should return an express router instance', function () {
    actionableStateIndex.should.equal(routerStub);
  });

  describe('GET /api/actionableStates', function () {

    it('should route to actionableState.controller.index', function () {
      routerStub.get
        .withArgs('/', 'actionableStateCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/actionableStates/:id', function () {

    it('should route to actionableState.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'actionableStateCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/actionableStates', function () {

    it('should route to actionableState.controller.create', function () {
      routerStub.post
        .withArgs('/', 'actionableStateCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/actionableStates/:id', function () {

    it('should route to actionableState.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'actionableStateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/actionableStates/:id', function () {

    it('should route to actionableState.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'actionableStateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/actionableStates/:id', function () {

    it('should route to actionableState.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'actionableStateCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
