

var proxyquire = require('proxyquire').noPreserveCache();

var applicantScoreLogCtrlStub = {
  index: 'applicantScoreLogCtrl.index',
  show: 'applicantScoreLogCtrl.show',
  create: 'applicantScoreLogCtrl.create',
  update: 'applicantScoreLogCtrl.update',
  destroy: 'applicantScoreLogCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var applicantScoreLogIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './applicantScoreLog.controller': applicantScoreLogCtrlStub,
});

describe('ApplicantScoreLog API Router:', function () {

  it('should return an express router instance', function () {
    applicantScoreLogIndex.should.equal(routerStub);
  });

  describe('GET /api/applicantScoreLogs', function () {

    it('should route to applicantScoreLog.controller.index', function () {
      routerStub.get
        .withArgs('/', 'applicantScoreLogCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/applicantScoreLogs/:id', function () {

    it('should route to applicantScoreLog.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'applicantScoreLogCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/applicantScoreLogs', function () {

    it('should route to applicantScoreLog.controller.create', function () {
      routerStub.post
        .withArgs('/', 'applicantScoreLogCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/applicantScoreLogs/:id', function () {

    it('should route to applicantScoreLog.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'applicantScoreLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/applicantScoreLogs/:id', function () {

    it('should route to applicantScoreLog.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'applicantScoreLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/applicantScoreLogs/:id', function () {

    it('should route to applicantScoreLog.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'applicantScoreLogCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
