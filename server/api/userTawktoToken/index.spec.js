

var proxyquire = require('proxyquire').noPreserveCache();

var userTawktoTokenCtrlStub = {
  index: 'userTawktoTokenCtrl.index',
  show: 'userTawktoTokenCtrl.show',
  create: 'userTawktoTokenCtrl.create',
  update: 'userTawktoTokenCtrl.update',
  destroy: 'userTawktoTokenCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var userTawktoTokenIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './userTawktoToken.controller': userTawktoTokenCtrlStub,
});

describe('UserTawktoToken API Router:', function () {

  it('should return an express router instance', function () {
    userTawktoTokenIndex.should.equal(routerStub);
  });

  describe('GET /api/userTawktoTokens', function () {

    it('should route to userTawktoToken.controller.index', function () {
      routerStub.get
        .withArgs('/', 'userTawktoTokenCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/userTawktoTokens/:id', function () {

    it('should route to userTawktoToken.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'userTawktoTokenCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/userTawktoTokens', function () {

    it('should route to userTawktoToken.controller.create', function () {
      routerStub.post
        .withArgs('/', 'userTawktoTokenCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/userTawktoTokens/:id', function () {

    it('should route to userTawktoToken.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'userTawktoTokenCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/userTawktoTokens/:id', function () {

    it('should route to userTawktoToken.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'userTawktoTokenCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/userTawktoTokens/:id', function () {

    it('should route to userTawktoToken.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'userTawktoTokenCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
