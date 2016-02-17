'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var instituteCtrlStub = {
  index: 'instituteCtrl.index',
  show: 'instituteCtrl.show',
  create: 'instituteCtrl.create',
  update: 'instituteCtrl.update',
  destroy: 'instituteCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var instituteIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './institute.controller': instituteCtrlStub
});

describe('Institute API Router:', function() {

  it('should return an express router instance', function() {
    instituteIndex.should.equal(routerStub);
  });

  describe('GET /api/institutes', function() {

    it('should route to institute.controller.index', function() {
      routerStub.get
        .withArgs('/', 'instituteCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/institutes/:id', function() {

    it('should route to institute.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'instituteCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/institutes', function() {

    it('should route to institute.controller.create', function() {
      routerStub.post
        .withArgs('/', 'instituteCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/institutes/:id', function() {

    it('should route to institute.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'instituteCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/institutes/:id', function() {

    it('should route to institute.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'instituteCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/institutes/:id', function() {

    it('should route to institute.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'instituteCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
