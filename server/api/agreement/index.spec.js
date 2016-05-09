'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var agreementCtrlStub = {
  index: 'agreementCtrl.index',
  show: 'agreementCtrl.show',
  create: 'agreementCtrl.create',
  update: 'agreementCtrl.update',
  destroy: 'agreementCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var agreementIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './agreement.controller': agreementCtrlStub,
});

describe('Agreement API Router:', function () {

  it('should return an express router instance', function () {
    agreementIndex.should.equal(routerStub);
  });

  describe('GET /api/agreements', function () {

    it('should route to agreement.controller.index', function () {
      routerStub.get
        .withArgs('/', 'agreementCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/agreements/:id', function () {

    it('should route to agreement.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'agreementCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/agreements', function () {

    it('should route to agreement.controller.create', function () {
      routerStub.post
        .withArgs('/', 'agreementCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/agreements/:id', function () {

    it('should route to agreement.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'agreementCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/agreements/:id', function () {

    it('should route to agreement.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'agreementCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/agreements/:id', function () {

    it('should route to agreement.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'agreementCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
