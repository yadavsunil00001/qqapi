'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var hotlineCtrlStub = {
  index: 'hotlineCtrl.index',
  show: 'hotlineCtrl.show',
  create: 'hotlineCtrl.create',
  update: 'hotlineCtrl.update',
  destroy: 'hotlineCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var hotlineIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './hotline.controller': hotlineCtrlStub
});

describe('Hotline API Router:', function() {

  it('should return an express router instance', function() {
    hotlineIndex.should.equal(routerStub);
  });

  describe('GET /api/hotlines', function() {

    it('should route to hotline.controller.index', function() {
      routerStub.get
        .withArgs('/', 'hotlineCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/hotlines/:id', function() {

    it('should route to hotline.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'hotlineCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/hotlines', function() {

    it('should route to hotline.controller.create', function() {
      routerStub.post
        .withArgs('/', 'hotlineCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/hotlines/:id', function() {

    it('should route to hotline.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'hotlineCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/hotlines/:id', function() {

    it('should route to hotline.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'hotlineCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/hotlines/:id', function() {

    it('should route to hotline.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'hotlineCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
