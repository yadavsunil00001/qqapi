

var proxyquire = require('proxyquire').noPreserveCache();

var jobsIndustryCtrlStub = {
  index: 'jobsIndustryCtrl.index',
  show: 'jobsIndustryCtrl.show',
  create: 'jobsIndustryCtrl.create',
  update: 'jobsIndustryCtrl.update',
  destroy: 'jobsIndustryCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var jobsIndustryIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './jobsIndustry.controller': jobsIndustryCtrlStub,
});

describe('JobsIndustry API Router:', function () {

  it('should return an express router instance', function () {
    jobsIndustryIndex.should.equal(routerStub);
  });

  describe('GET /api/jobsIndustries', function () {

    it('should route to jobsIndustry.controller.index', function () {
      routerStub.get
        .withArgs('/', 'jobsIndustryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobsIndustries/:id', function () {

    it('should route to jobsIndustry.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'jobsIndustryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobsIndustries', function () {

    it('should route to jobsIndustry.controller.create', function () {
      routerStub.post
        .withArgs('/', 'jobsIndustryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobsIndustries/:id', function () {

    it('should route to jobsIndustry.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'jobsIndustryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobsIndustries/:id', function () {

    it('should route to jobsIndustry.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'jobsIndustryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobsIndustries/:id', function () {

    it('should route to jobsIndustry.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'jobsIndustryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
