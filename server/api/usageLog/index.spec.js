

var proxyquire = require('proxyquire').noPreserveCache();

var usageLogCtrlStub = {
  index: 'usageLogCtrl.index',
  show: 'usageLogCtrl.show',
  create: 'usageLogCtrl.create',
  update: 'usageLogCtrl.update',
  destroy: 'usageLogCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var usageLogIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './usageLog.controller': usageLogCtrlStub,
});

describe('UsageLog API Router:', function () {

  it('should return an express router instance', function () {
    usageLogIndex.should.equal(routerStub);
  });

  describe('GET /api/usageLogs', function () {

    it('should route to usageLog.controller.index', function () {
      routerStub.get
        .withArgs('/', 'usageLogCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/usageLogs/:id', function () {

    it('should route to usageLog.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'usageLogCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/usageLogs', function () {

    it('should route to usageLog.controller.create', function () {
      routerStub.post
        .withArgs('/', 'usageLogCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/usageLogs/:id', function () {

    it('should route to usageLog.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'usageLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/usageLogs/:id', function () {

    it('should route to usageLog.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'usageLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/usageLogs/:id', function () {

    it('should route to usageLog.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'usageLogCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
