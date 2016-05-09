

var proxyquire = require('proxyquire').noPreserveCache();

var logoCtrlStub = {
  index: 'logoCtrl.index',
  show: 'logoCtrl.show',
  create: 'logoCtrl.create',
  update: 'logoCtrl.update',
  destroy: 'logoCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var logoIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './logo.controller': logoCtrlStub,
});

describe('Logo API Router:', function () {

  it('should return an express router instance', function () {
    logoIndex.should.equal(routerStub);
  });

  describe('GET /api/logos', function () {

    it('should route to logo.controller.index', function () {
      routerStub.get
        .withArgs('/', 'logoCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/logos/:id', function () {

    it('should route to logo.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'logoCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/logos', function () {

    it('should route to logo.controller.create', function () {
      routerStub.post
        .withArgs('/', 'logoCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/logos/:id', function () {

    it('should route to logo.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'logoCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/logos/:id', function () {

    it('should route to logo.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'logoCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/logos/:id', function () {

    it('should route to logo.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'logoCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
