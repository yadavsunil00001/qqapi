

var proxyquire = require('proxyquire').noPreserveCache();

var referenceCtrlStub = {
  index: 'referenceCtrl.index',
  show: 'referenceCtrl.show',
  create: 'referenceCtrl.create',
  update: 'referenceCtrl.update',
  destroy: 'referenceCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var referenceIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './reference.controller': referenceCtrlStub
});

describe('Reference API Router:', function() {

  it('should return an express router instance', function() {
    referenceIndex.should.equal(routerStub);
  });

  describe('GET /api/jobs', function() {

    it('should route to reference.controller.index', function() {
      routerStub.get
        .withArgs('/', 'referenceCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobs/:id', function() {

    it('should route to reference.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'referenceCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobs', function() {

    it('should route to reference.controller.create', function() {
      routerStub.post
        .withArgs('/', 'referenceCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobs/:id', function() {

    it('should route to reference.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'referenceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobs/:id', function() {

    it('should route to reference.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'referenceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobs/:id', function() {

    it('should route to reference.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'referenceCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
