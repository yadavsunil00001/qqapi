

var proxyquire = require('proxyquire').noPreserveCache();

var industryCtrlStub = {
  index: 'industryCtrl.index',
  show: 'industryCtrl.show',
  create: 'industryCtrl.create',
  update: 'industryCtrl.update',
  destroy: 'industryCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var industryIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './industry.controller': industryCtrlStub,
});

describe('Industry API Router:', function () {

  it('should return an express router instance', function () {
    industryIndex.should.equal(routerStub);
  });

  describe('GET /api/industries', function () {

    it('should route to industry.controller.index', function () {
      routerStub.get
        .withArgs('/', 'industryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/industries/:id', function () {

    it('should route to industry.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'industryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/industries', function () {

    it('should route to industry.controller.create', function () {
      routerStub.post
        .withArgs('/', 'industryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/industries/:id', function () {

    it('should route to industry.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'industryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/industries/:id', function () {

    it('should route to industry.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'industryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/industries/:id', function () {

    it('should route to industry.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'industryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
