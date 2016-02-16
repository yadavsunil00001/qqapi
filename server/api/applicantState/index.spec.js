'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var applicantStateCtrlStub = {
  index: 'applicantStateCtrl.index',
  show: 'applicantStateCtrl.show',
  create: 'applicantStateCtrl.create',
  update: 'applicantStateCtrl.update',
  destroy: 'applicantStateCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var applicantStateIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './applicantState.controller': applicantStateCtrlStub
});

describe('ApplicantState API Router:', function() {

  it('should return an express router instance', function() {
    applicantStateIndex.should.equal(routerStub);
  });

  describe('GET /api/applicantStates', function() {

    it('should route to applicantState.controller.index', function() {
      routerStub.get
        .withArgs('/', 'applicantStateCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/applicantStates/:id', function() {

    it('should route to applicantState.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'applicantStateCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/applicantStates', function() {

    it('should route to applicantState.controller.create', function() {
      routerStub.post
        .withArgs('/', 'applicantStateCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/applicantStates/:id', function() {

    it('should route to applicantState.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'applicantStateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/applicantStates/:id', function() {

    it('should route to applicantState.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'applicantStateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/applicantStates/:id', function() {

    it('should route to applicantState.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'applicantStateCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
