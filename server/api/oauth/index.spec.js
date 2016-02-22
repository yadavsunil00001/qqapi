'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var oauthCtrlStub = {
  index: 'oauthCtrl.index',
  show: 'oauthCtrl.show',
  create: 'oauthCtrl.create',
  update: 'oauthCtrl.update',
  destroy: 'oauthCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var oauthIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './oauth.controller': oauthCtrlStub
});

describe('Oauth API Router:', function() {

  it('should return an express router instance', function() {
    oauthIndex.should.equal(routerStub);
  });

  describe('GET /api/oauth', function() {

    it('should route to oauth.controller.index', function() {
      routerStub.get
        .withArgs('/', 'oauthCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/oauth/:id', function() {

    it('should route to oauth.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'oauthCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/oauth', function() {

    it('should route to oauth.controller.create', function() {
      routerStub.post
        .withArgs('/', 'oauthCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/oauth/:id', function() {

    it('should route to oauth.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'oauthCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/oauth/:id', function() {

    it('should route to oauth.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'oauthCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/oauth/:id', function() {

    it('should route to oauth.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'oauthCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
