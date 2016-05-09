'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var stateCtrlStub = {
  index: 'stateCtrl.index',
  show: 'stateCtrl.show',
  create: 'stateCtrl.create',
  update: 'stateCtrl.update',
  destroy: 'stateCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var stateIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './state.controller': stateCtrlStub,
});

describe('State API Router:', function () {

  it('should return an express router instance', function () {
    stateIndex.should.equal(routerStub);
  });

  describe('GET /api/states', function () {

    it('should route to state.controller.index', function () {
      routerStub.get
        .withArgs('/', 'stateCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/states/:id', function () {

    it('should route to state.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'stateCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/states', function () {

    it('should route to state.controller.create', function () {
      routerStub.post
        .withArgs('/', 'stateCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/states/:id', function () {

    it('should route to state.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'stateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/states/:id', function () {

    it('should route to state.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'stateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/states/:id', function () {

    it('should route to state.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'stateCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
