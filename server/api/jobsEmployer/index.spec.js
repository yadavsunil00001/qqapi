

var proxyquire = require('proxyquire').noPreserveCache();

var jobsEmployerCtrlStub = {
  index: 'jobsEmployerCtrl.index',
  show: 'jobsEmployerCtrl.show',
  create: 'jobsEmployerCtrl.create',
  update: 'jobsEmployerCtrl.update',
  destroy: 'jobsEmployerCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var jobsEmployerIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './jobsEmployer.controller': jobsEmployerCtrlStub,
});

describe('JobsEmployer API Router:', function () {

  it('should return an express router instance', function () {
    jobsEmployerIndex.should.equal(routerStub);
  });

  describe('GET /api/jobsEmployers', function () {

    it('should route to jobsEmployer.controller.index', function () {
      routerStub.get
        .withArgs('/', 'jobsEmployerCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobsEmployers/:id', function () {

    it('should route to jobsEmployer.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'jobsEmployerCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobsEmployers', function () {

    it('should route to jobsEmployer.controller.create', function () {
      routerStub.post
        .withArgs('/', 'jobsEmployerCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobsEmployers/:id', function () {

    it('should route to jobsEmployer.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'jobsEmployerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobsEmployers/:id', function () {

    it('should route to jobsEmployer.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'jobsEmployerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobsEmployers/:id', function () {

    it('should route to jobsEmployer.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'jobsEmployerCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
