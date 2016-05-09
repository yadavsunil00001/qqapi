

var proxyquire = require('proxyquire').noPreserveCache();

var summaryCtrlStub = {
  index: 'summaryCtrl.index',
  show: 'summaryCtrl.show',
  create: 'summaryCtrl.create',
  update: 'summaryCtrl.update',
  destroy: 'summaryCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var summaryIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './summary.controller': summaryCtrlStub,
});

describe('Summary API Router:', function () {

  it('should return an express router instance', function () {
    summaryIndex.should.equal(routerStub);
  });

  describe('GET /api/summary', function () {

    it('should route to summary.controller.index', function () {
      routerStub.get
        .withArgs('/', 'summaryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/summary/:id', function () {

    it('should route to summary.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'summaryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/summary', function () {

    it('should route to summary.controller.create', function () {
      routerStub.post
        .withArgs('/', 'summaryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/summary/:id', function () {

    it('should route to summary.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'summaryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/summary/:id', function () {

    it('should route to summary.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'summaryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/summary/:id', function () {

    it('should route to summary.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'summaryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
