'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var followerTypeCtrlStub = {
  index: 'followerTypeCtrl.index',
  show: 'followerTypeCtrl.show',
  create: 'followerTypeCtrl.create',
  update: 'followerTypeCtrl.update',
  destroy: 'followerTypeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var followerTypeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './followerType.controller': followerTypeCtrlStub
});

describe('FollowerType API Router:', function() {

  it('should return an express router instance', function() {
    followerTypeIndex.should.equal(routerStub);
  });

  describe('GET /api/followerTypes', function() {

    it('should route to followerType.controller.index', function() {
      routerStub.get
        .withArgs('/', 'followerTypeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/followerTypes/:id', function() {

    it('should route to followerType.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'followerTypeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/followerTypes', function() {

    it('should route to followerType.controller.create', function() {
      routerStub.post
        .withArgs('/', 'followerTypeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/followerTypes/:id', function() {

    it('should route to followerType.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'followerTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/followerTypes/:id', function() {

    it('should route to followerType.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'followerTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/followerTypes/:id', function() {

    it('should route to followerType.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'followerTypeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
