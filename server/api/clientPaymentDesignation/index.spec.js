'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var clientPaymentDesignationCtrlStub = {
  index: 'clientPaymentDesignationCtrl.index',
  show: 'clientPaymentDesignationCtrl.show',
  create: 'clientPaymentDesignationCtrl.create',
  update: 'clientPaymentDesignationCtrl.update',
  destroy: 'clientPaymentDesignationCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var clientPaymentDesignationIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './clientPaymentDesignation.controller': clientPaymentDesignationCtrlStub,
});

describe('ClientPaymentDesignation API Router:', function () {

  it('should return an express router instance', function () {
    clientPaymentDesignationIndex.should.equal(routerStub);
  });

  describe('GET /api/clientPaymentDesignations', function () {

    it('should route to clientPaymentDesignation.controller.index', function () {
      routerStub.get
        .withArgs('/', 'clientPaymentDesignationCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/clientPaymentDesignations/:id', function () {

    it('should route to clientPaymentDesignation.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'clientPaymentDesignationCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/clientPaymentDesignations', function () {

    it('should route to clientPaymentDesignation.controller.create', function () {
      routerStub.post
        .withArgs('/', 'clientPaymentDesignationCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/clientPaymentDesignations/:id', function () {

    it('should route to clientPaymentDesignation.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'clientPaymentDesignationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/clientPaymentDesignations/:id', function () {

    it('should route to clientPaymentDesignation.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'clientPaymentDesignationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/clientPaymentDesignations/:id', function () {

    it('should route to clientPaymentDesignation.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'clientPaymentDesignationCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
