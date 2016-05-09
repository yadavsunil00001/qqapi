

var proxyquire = require('proxyquire').noPreserveCache();

var jobContentCtrlStub = {
  index: 'jobContentCtrl.index',
  show: 'jobContentCtrl.show',
  create: 'jobContentCtrl.create',
  update: 'jobContentCtrl.update',
  destroy: 'jobContentCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var jobContentIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './jobContent.controller': jobContentCtrlStub,
});

describe('JobContent API Router:', function () {

  it('should return an express router instance', function () {
    jobContentIndex.should.equal(routerStub);
  });

  describe('GET /api/jobContents', function () {

    it('should route to jobContent.controller.index', function () {
      routerStub.get
        .withArgs('/', 'jobContentCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobContents/:id', function () {

    it('should route to jobContent.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'jobContentCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobContents', function () {

    it('should route to jobContent.controller.create', function () {
      routerStub.post
        .withArgs('/', 'jobContentCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobContents/:id', function () {

    it('should route to jobContent.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'jobContentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobContents/:id', function () {

    it('should route to jobContent.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'jobContentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobContents/:id', function () {

    it('should route to jobContent.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'jobContentCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
