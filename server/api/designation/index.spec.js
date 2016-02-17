'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var designationCtrlStub = {
  index: 'designationCtrl.index',
  show: 'designationCtrl.show',
  create: 'designationCtrl.create',
  update: 'designationCtrl.update',
  destroy: 'designationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var designationIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './designation.controller': designationCtrlStub
});

describe('Designation API Router:', function() {

  it('should return an express router instance', function() {
    designationIndex.should.equal(routerStub);
  });

  describe('GET /api/designations', function() {

    it('should route to designation.controller.index', function() {
      routerStub.get
        .withArgs('/', 'designationCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/designations/:id', function() {

    it('should route to designation.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'designationCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/designations', function() {

    it('should route to designation.controller.create', function() {
      routerStub.post
        .withArgs('/', 'designationCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/designations/:id', function() {

    it('should route to designation.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'designationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/designations/:id', function() {

    it('should route to designation.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'designationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/designations/:id', function() {

    it('should route to designation.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'designationCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
