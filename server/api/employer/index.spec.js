'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var employerCtrlStub = {
  index: 'employerCtrl.index',
  show: 'employerCtrl.show',
  create: 'employerCtrl.create',
  update: 'employerCtrl.update',
  destroy: 'employerCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var employerIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './employer.controller': employerCtrlStub
});

describe('Employer API Router:', function() {

  it('should return an express router instance', function() {
    employerIndex.should.equal(routerStub);
  });

  describe('GET /api/employers', function() {

    it('should route to employer.controller.index', function() {
      routerStub.get
        .withArgs('/', 'employerCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/employers/:id', function() {

    it('should route to employer.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'employerCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/employers', function() {

    it('should route to employer.controller.create', function() {
      routerStub.post
        .withArgs('/', 'employerCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/employers/:id', function() {

    it('should route to employer.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'employerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/employers/:id', function() {

    it('should route to employer.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'employerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/employers/:id', function() {

    it('should route to employer.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'employerCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
