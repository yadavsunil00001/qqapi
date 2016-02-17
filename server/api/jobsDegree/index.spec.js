'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobsDegreeCtrlStub = {
  index: 'jobsDegreeCtrl.index',
  show: 'jobsDegreeCtrl.show',
  create: 'jobsDegreeCtrl.create',
  update: 'jobsDegreeCtrl.update',
  destroy: 'jobsDegreeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var jobsDegreeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './jobsDegree.controller': jobsDegreeCtrlStub
});

describe('JobsDegree API Router:', function() {

  it('should return an express router instance', function() {
    jobsDegreeIndex.should.equal(routerStub);
  });

  describe('GET /api/jobsDegrees', function() {

    it('should route to jobsDegree.controller.index', function() {
      routerStub.get
        .withArgs('/', 'jobsDegreeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobsDegrees/:id', function() {

    it('should route to jobsDegree.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'jobsDegreeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobsDegrees', function() {

    it('should route to jobsDegree.controller.create', function() {
      routerStub.post
        .withArgs('/', 'jobsDegreeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobsDegrees/:id', function() {

    it('should route to jobsDegree.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'jobsDegreeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobsDegrees/:id', function() {

    it('should route to jobsDegree.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'jobsDegreeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobsDegrees/:id', function() {

    it('should route to jobsDegree.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'jobsDegreeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
