'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var clientPaymentMapCtrlStub = {
  index: 'clientPaymentMapCtrl.index',
  show: 'clientPaymentMapCtrl.show',
  create: 'clientPaymentMapCtrl.create',
  update: 'clientPaymentMapCtrl.update',
  destroy: 'clientPaymentMapCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var clientPaymentMapIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './clientPaymentMap.controller': clientPaymentMapCtrlStub
});

describe('ClientPaymentMap API Router:', function() {

  it('should return an express router instance', function() {
    clientPaymentMapIndex.should.equal(routerStub);
  });

  describe('GET /api/clientPaymentMaps', function() {

    it('should route to clientPaymentMap.controller.index', function() {
      routerStub.get
        .withArgs('/', 'clientPaymentMapCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/clientPaymentMaps/:id', function() {

    it('should route to clientPaymentMap.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'clientPaymentMapCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/clientPaymentMaps', function() {

    it('should route to clientPaymentMap.controller.create', function() {
      routerStub.post
        .withArgs('/', 'clientPaymentMapCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/clientPaymentMaps/:id', function() {

    it('should route to clientPaymentMap.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'clientPaymentMapCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/clientPaymentMaps/:id', function() {

    it('should route to clientPaymentMap.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'clientPaymentMapCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/clientPaymentMaps/:id', function() {

    it('should route to clientPaymentMap.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'clientPaymentMapCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
