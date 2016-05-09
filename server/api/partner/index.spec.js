'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var partnerCtrlStub = {
  index: 'partnerCtrl.index',
  show: 'partnerCtrl.show',
  create: 'partnerCtrl.create',
  update: 'partnerCtrl.update',
  destroy: 'partnerCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var partnerIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './partner.controller': partnerCtrlStub,
});

describe('Partner API Router:', function () {

  it('should return an express router instance', function () {
    partnerIndex.should.equal(routerStub);
  });

  describe('GET /api/partners', function () {

    it('should route to partner.controller.index', function () {
      routerStub.get
        .withArgs('/', 'partnerCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/partners/:id', function () {

    it('should route to partner.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'partnerCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/partners', function () {

    it('should route to partner.controller.create', function () {
      routerStub.post
        .withArgs('/', 'partnerCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/partners/:id', function () {

    it('should route to partner.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'partnerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/partners/:id', function () {

    it('should route to partner.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'partnerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/partners/:id', function () {

    it('should route to partner.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'partnerCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
