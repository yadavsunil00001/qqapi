

var proxyquire = require('proxyquire').noPreserveCache();

var provinceCtrlStub = {
  index: 'provinceCtrl.index',
  show: 'provinceCtrl.show',
  create: 'provinceCtrl.create',
  update: 'provinceCtrl.update',
  destroy: 'provinceCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var provinceIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './province.controller': provinceCtrlStub,
});

describe('Province API Router:', function () {

  it('should return an express router instance', function () {
    provinceIndex.should.equal(routerStub);
  });

  describe('GET /api/provinces', function () {

    it('should route to province.controller.index', function () {
      routerStub.get
        .withArgs('/', 'provinceCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/provinces/:id', function () {

    it('should route to province.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'provinceCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/provinces', function () {

    it('should route to province.controller.create', function () {
      routerStub.post
        .withArgs('/', 'provinceCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/provinces/:id', function () {

    it('should route to province.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'provinceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/provinces/:id', function () {

    it('should route to province.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'provinceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/provinces/:id', function () {

    it('should route to province.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'provinceCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
