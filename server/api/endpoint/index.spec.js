'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var endpointCtrlStub = {
  index: 'endpointCtrl.index',
  show: 'endpointCtrl.show',
  create: 'endpointCtrl.create',
  update: 'endpointCtrl.update',
  destroy: 'endpointCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var endpointIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './endpoint.controller': endpointCtrlStub
});

describe('Endpoint API Router:', function() {

  it('should return an express router instance', function() {
    endpointIndex.should.equal(routerStub);
  });

  describe('GET /api/endpoints', function() {

    it('should route to endpoint.controller.index', function() {
      routerStub.get
        .withArgs('/', 'endpointCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/endpoints/:id', function() {

    it('should route to endpoint.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'endpointCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/endpoints', function() {

    it('should route to endpoint.controller.create', function() {
      routerStub.post
        .withArgs('/', 'endpointCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/endpoints/:id', function() {

    it('should route to endpoint.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'endpointCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/endpoints/:id', function() {

    it('should route to endpoint.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'endpointCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/endpoints/:id', function() {

    it('should route to endpoint.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'endpointCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
