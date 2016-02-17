'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var regionCtrlStub = {
  index: 'regionCtrl.index',
  show: 'regionCtrl.show',
  create: 'regionCtrl.create',
  update: 'regionCtrl.update',
  destroy: 'regionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var regionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './region.controller': regionCtrlStub
});

describe('Region API Router:', function() {

  it('should return an express router instance', function() {
    regionIndex.should.equal(routerStub);
  });

  describe('GET /api/regions', function() {

    it('should route to region.controller.index', function() {
      routerStub.get
        .withArgs('/', 'regionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/regions/:id', function() {

    it('should route to region.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'regionCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/regions', function() {

    it('should route to region.controller.create', function() {
      routerStub.post
        .withArgs('/', 'regionCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/regions/:id', function() {

    it('should route to region.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'regionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/regions/:id', function() {

    it('should route to region.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'regionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/regions/:id', function() {

    it('should route to region.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'regionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
