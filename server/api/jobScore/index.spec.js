

var proxyquire = require('proxyquire').noPreserveCache();

var jobScoreCtrlStub = {
  index: 'jobScoreCtrl.index',
  show: 'jobScoreCtrl.show',
  create: 'jobScoreCtrl.create',
  update: 'jobScoreCtrl.update',
  destroy: 'jobScoreCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var jobScoreIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './jobScore.controller': jobScoreCtrlStub,
});

describe('JobScore API Router:', function () {

  it('should return an express router instance', function () {
    jobScoreIndex.should.equal(routerStub);
  });

  describe('GET /api/jobScores', function () {

    it('should route to jobScore.controller.index', function () {
      routerStub.get
        .withArgs('/', 'jobScoreCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobScores/:id', function () {

    it('should route to jobScore.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'jobScoreCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobScores', function () {

    it('should route to jobScore.controller.create', function () {
      routerStub.post
        .withArgs('/', 'jobScoreCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobScores/:id', function () {

    it('should route to jobScore.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'jobScoreCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobScores/:id', function () {

    it('should route to jobScore.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'jobScoreCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobScores/:id', function () {

    it('should route to jobScore.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'jobScoreCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
