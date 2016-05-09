'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var clientPreferredIndustryCtrlStub = {
  index: 'clientPreferredIndustryCtrl.index',
  show: 'clientPreferredIndustryCtrl.show',
  create: 'clientPreferredIndustryCtrl.create',
  update: 'clientPreferredIndustryCtrl.update',
  destroy: 'clientPreferredIndustryCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var clientPreferredIndustryIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './clientPreferredIndustry.controller': clientPreferredIndustryCtrlStub,
});

describe('ClientPreferredIndustry API Router:', function () {

  it('should return an express router instance', function () {
    clientPreferredIndustryIndex.should.equal(routerStub);
  });

  describe('GET /api/clientPreferredIndustries', function () {

    it('should route to clientPreferredIndustry.controller.index', function () {
      routerStub.get
        .withArgs('/', 'clientPreferredIndustryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/clientPreferredIndustries/:id', function () {

    it('should route to clientPreferredIndustry.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'clientPreferredIndustryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/clientPreferredIndustries', function () {

    it('should route to clientPreferredIndustry.controller.create', function () {
      routerStub.post
        .withArgs('/', 'clientPreferredIndustryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/clientPreferredIndustries/:id', function () {

    it('should route to clientPreferredIndustry.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'clientPreferredIndustryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/clientPreferredIndustries/:id', function () {

    it('should route to clientPreferredIndustry.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'clientPreferredIndustryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/clientPreferredIndustries/:id', function () {

    it('should route to clientPreferredIndustry.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'clientPreferredIndustryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
