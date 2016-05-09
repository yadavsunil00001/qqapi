

var proxyquire = require('proxyquire').noPreserveCache();

var applicantPreferenceTimeCtrlStub = {
  index: 'applicantPreferenceTimeCtrl.index',
  show: 'applicantPreferenceTimeCtrl.show',
  create: 'applicantPreferenceTimeCtrl.create',
  update: 'applicantPreferenceTimeCtrl.update',
  destroy: 'applicantPreferenceTimeCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var applicantPreferenceTimeIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './applicantPreferenceTime.controller': applicantPreferenceTimeCtrlStub,
});

describe('ApplicantPreferenceTime API Router:', function () {

  it('should return an express router instance', function () {
    applicantPreferenceTimeIndex.should.equal(routerStub);
  });

  describe('GET /api/applicantPreferenceTimes', function () {

    it('should route to applicantPreferenceTime.controller.index', function () {
      routerStub.get
        .withArgs('/', 'applicantPreferenceTimeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/applicantPreferenceTimes/:id', function () {

    it('should route to applicantPreferenceTime.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'applicantPreferenceTimeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/applicantPreferenceTimes', function () {

    it('should route to applicantPreferenceTime.controller.create', function () {
      routerStub.post
        .withArgs('/', 'applicantPreferenceTimeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/applicantPreferenceTimes/:id', function () {

    it('should route to applicantPreferenceTime.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'applicantPreferenceTimeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/applicantPreferenceTimes/:id', function () {

    it('should route to applicantPreferenceTime.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'applicantPreferenceTimeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/applicantPreferenceTimes/:id', function () {

    it('should route to applicantPreferenceTime.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'applicantPreferenceTimeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
