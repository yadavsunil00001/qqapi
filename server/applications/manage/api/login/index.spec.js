'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var loginCtrlStub = {
  index: 'loginCtrl.index',
  show: 'loginCtrl.show',
  create: 'loginCtrl.create',
  update: 'loginCtrl.update',
  destroy: 'loginCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var loginIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './login.controller': loginCtrlStub
});

describe('Login API Router:', function() {

  it('should return an express router instance', function() {
    loginIndex.should.equal(routerStub);
  });

  describe('GET /api/login', function() {

    it('should route to login.controller.index', function() {
      routerStub.get
        .withArgs('/', 'loginCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/login/:id', function() {

    it('should route to login.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'loginCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/login', function() {

    it('should route to login.controller.create', function() {
      routerStub.post
        .withArgs('/', 'loginCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/login/:id', function() {

    it('should route to login.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'loginCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/login/:id', function() {

    it('should route to login.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'loginCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/login/:id', function() {

    it('should route to login.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'loginCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
