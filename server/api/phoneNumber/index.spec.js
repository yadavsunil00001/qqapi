'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var phoneNumberCtrlStub = {
  index: 'phoneNumberCtrl.index',
  show: 'phoneNumberCtrl.show',
  create: 'phoneNumberCtrl.create',
  update: 'phoneNumberCtrl.update',
  destroy: 'phoneNumberCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var phoneNumberIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './phoneNumber.controller': phoneNumberCtrlStub
});

describe('PhoneNumber API Router:', function() {

  it('should return an express router instance', function() {
    phoneNumberIndex.should.equal(routerStub);
  });

  describe('GET /api/phoneNumbers', function() {

    it('should route to phoneNumber.controller.index', function() {
      routerStub.get
        .withArgs('/', 'phoneNumberCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/phoneNumbers/:id', function() {

    it('should route to phoneNumber.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'phoneNumberCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/phoneNumbers', function() {

    it('should route to phoneNumber.controller.create', function() {
      routerStub.post
        .withArgs('/', 'phoneNumberCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/phoneNumbers/:id', function() {

    it('should route to phoneNumber.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'phoneNumberCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/phoneNumbers/:id', function() {

    it('should route to phoneNumber.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'phoneNumberCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/phoneNumbers/:id', function() {

    it('should route to phoneNumber.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'phoneNumberCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
