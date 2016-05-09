'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var authoriseCtrlStub = {
  index: 'authoriseCtrl.index',
  show: 'authoriseCtrl.show',
  create: 'authoriseCtrl.create',
  update: 'authoriseCtrl.update',
  destroy: 'authoriseCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var authoriseIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './authorise.controller': authoriseCtrlStub,
});

describe('Authorise API Router:', function () {

  it('should return an express router instance', function () {
    authoriseIndex.should.equal(routerStub);
  });

  describe('GET /api/authorise', function () {

    it('should route to authorise.controller.index', function () {
      routerStub.get
        .withArgs('/', 'authoriseCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/authorise/:id', function () {

    it('should route to authorise.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'authoriseCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/authorise', function () {

    it('should route to authorise.controller.create', function () {
      routerStub.post
        .withArgs('/', 'authoriseCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/authorise/:id', function () {

    it('should route to authorise.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'authoriseCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/authorise/:id', function () {

    it('should route to authorise.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'authoriseCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/authorise/:id', function () {

    it('should route to authorise.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'authoriseCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
