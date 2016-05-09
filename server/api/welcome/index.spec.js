

var proxyquire = require('proxyquire').noPreserveCache();

var welcomeCtrlStub = {
  index: 'welcomeCtrl.index',
  show: 'welcomeCtrl.show',
  create: 'welcomeCtrl.create',
  update: 'welcomeCtrl.update',
  destroy: 'welcomeCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var welcomeIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './welcome.controller': welcomeCtrlStub,
});

describe('Welcome API Router:', function () {

  it('should return an express router instance', function () {
    welcomeIndex.should.equal(routerStub);
  });

  describe('GET /api/welcomes', function () {

    it('should route to welcome.controller.index', function () {
      routerStub.get
        .withArgs('/', 'welcomeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/welcomes/:id', function () {

    it('should route to welcome.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'welcomeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/welcomes', function () {

    it('should route to welcome.controller.create', function () {
      routerStub.post
        .withArgs('/', 'welcomeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/welcomes/:id', function () {

    it('should route to welcome.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'welcomeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/welcomes/:id', function () {

    it('should route to welcome.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'welcomeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/welcomes/:id', function () {

    it('should route to welcome.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'welcomeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
