'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var screeningStateCtrlStub = {
  index: 'screeningStateCtrl.index',
  show: 'screeningStateCtrl.show',
  create: 'screeningStateCtrl.create',
  update: 'screeningStateCtrl.update',
  destroy: 'screeningStateCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var screeningStateIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './screeningState.controller': screeningStateCtrlStub,
});

describe('ScreeningState API Router:', function () {

  it('should return an express router instance', function () {
    screeningStateIndex.should.equal(routerStub);
  });

  describe('GET /api/screeningStates', function () {

    it('should route to screeningState.controller.index', function () {
      routerStub.get
        .withArgs('/', 'screeningStateCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/screeningStates/:id', function () {

    it('should route to screeningState.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'screeningStateCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/screeningStates', function () {

    it('should route to screeningState.controller.create', function () {
      routerStub.post
        .withArgs('/', 'screeningStateCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/screeningStates/:id', function () {

    it('should route to screeningState.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'screeningStateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/screeningStates/:id', function () {

    it('should route to screeningState.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'screeningStateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/screeningStates/:id', function () {

    it('should route to screeningState.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'screeningStateCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
