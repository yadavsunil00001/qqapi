'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobCommentCtrlStub = {
  index: 'jobCommentCtrl.index',
  show: 'jobCommentCtrl.show',
  create: 'jobCommentCtrl.create',
  update: 'jobCommentCtrl.update',
  destroy: 'jobCommentCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var jobCommentIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './jobComment.controller': jobCommentCtrlStub,
});

describe('JobComment API Router:', function () {

  it('should return an express router instance', function () {
    jobCommentIndex.should.equal(routerStub);
  });

  describe('GET /api/jobComments', function () {

    it('should route to jobComment.controller.index', function () {
      routerStub.get
        .withArgs('/', 'jobCommentCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobComments/:id', function () {

    it('should route to jobComment.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'jobCommentCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobComments', function () {

    it('should route to jobComment.controller.create', function () {
      routerStub.post
        .withArgs('/', 'jobCommentCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobComments/:id', function () {

    it('should route to jobComment.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'jobCommentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobComments/:id', function () {

    it('should route to jobComment.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'jobCommentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobComments/:id', function () {

    it('should route to jobComment.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'jobCommentCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
