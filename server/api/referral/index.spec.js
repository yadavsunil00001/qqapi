'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var referralCtrlStub = {
  index: 'referralCtrl.index',
  show: 'referralCtrl.show',
  create: 'referralCtrl.create',
  update: 'referralCtrl.update',
  destroy: 'referralCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var referralIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './referral.controller': referralCtrlStub
});

describe('Referral API Router:', function() {

  it('should return an express router instance', function() {
    referralIndex.should.equal(routerStub);
  });

  describe('GET /api/referrals', function() {

    it('should route to referral.controller.index', function() {
      routerStub.get
        .withArgs('/', 'referralCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/referrals/:id', function() {

    it('should route to referral.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'referralCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/referrals', function() {

    it('should route to referral.controller.create', function() {
      routerStub.post
        .withArgs('/', 'referralCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/referrals/:id', function() {

    it('should route to referral.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'referralCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/referrals/:id', function() {

    it('should route to referral.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'referralCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/referrals/:id', function() {

    it('should route to referral.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'referralCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
