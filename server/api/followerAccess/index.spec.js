'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var followerAccessCtrlStub = {
  index: 'followerAccessCtrl.index',
  show: 'followerAccessCtrl.show',
  create: 'followerAccessCtrl.create',
  update: 'followerAccessCtrl.update',
  destroy: 'followerAccessCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var followerAccessIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './followerAccess.controller': followerAccessCtrlStub,
});

describe('FollowerAccess API Router:', function () {

  it('should return an express router instance', function () {
    followerAccessIndex.should.equal(routerStub);
  });

  describe('GET /api/followerAccess', function () {

    it('should route to followerAccess.controller.index', function () {
      routerStub.get
        .withArgs('/', 'followerAccessCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/followerAccess/:id', function () {

    it('should route to followerAccess.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'followerAccessCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/followerAccess', function () {

    it('should route to followerAccess.controller.create', function () {
      routerStub.post
        .withArgs('/', 'followerAccessCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/followerAccess/:id', function () {

    it('should route to followerAccess.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'followerAccessCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/followerAccess/:id', function () {

    it('should route to followerAccess.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'followerAccessCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/followerAccess/:id', function () {

    it('should route to followerAccess.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'followerAccessCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
