

var proxyquire = require('proxyquire').noPreserveCache();

var clientPreferredFunctionCtrlStub = {
  index: 'clientPreferredFunctionCtrl.index',
  show: 'clientPreferredFunctionCtrl.show',
  create: 'clientPreferredFunctionCtrl.create',
  update: 'clientPreferredFunctionCtrl.update',
  destroy: 'clientPreferredFunctionCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var clientPreferredFunctionIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './clientPreferredFunction.controller': clientPreferredFunctionCtrlStub,
});

describe('ClientPreferredFunction API Router:', function () {

  it('should return an express router instance', function () {
    clientPreferredFunctionIndex.should.equal(routerStub);
  });

  describe('GET /api/clientPreferredFunctions', function () {

    it('should route to clientPreferredFunction.controller.index', function () {
      routerStub.get
        .withArgs('/', 'clientPreferredFunctionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/clientPreferredFunctions/:id', function () {

    it('should route to clientPreferredFunction.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'clientPreferredFunctionCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/clientPreferredFunctions', function () {

    it('should route to clientPreferredFunction.controller.create', function () {
      routerStub.post
        .withArgs('/', 'clientPreferredFunctionCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/clientPreferredFunctions/:id', function () {

    it('should route to clientPreferredFunction.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'clientPreferredFunctionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/clientPreferredFunctions/:id', function () {

    it('should route to clientPreferredFunction.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'clientPreferredFunctionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/clientPreferredFunctions/:id', function () {

    it('should route to clientPreferredFunction.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'clientPreferredFunctionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
