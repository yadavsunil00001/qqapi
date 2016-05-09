'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var applicantScreeningCtrlStub = {
  index: 'applicantScreeningCtrl.index',
  show: 'applicantScreeningCtrl.show',
  create: 'applicantScreeningCtrl.create',
  update: 'applicantScreeningCtrl.update',
  destroy: 'applicantScreeningCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var applicantScreeningIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './applicantScreening.controller': applicantScreeningCtrlStub,
});

describe('ApplicantScreening API Router:', function () {

  it('should return an express router instance', function () {
    applicantScreeningIndex.should.equal(routerStub);
  });

  describe('GET /api/applicantScreenings', function () {

    it('should route to applicantScreening.controller.index', function () {
      routerStub.get
        .withArgs('/', 'applicantScreeningCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/applicantScreenings/:id', function () {

    it('should route to applicantScreening.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'applicantScreeningCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/applicantScreenings', function () {

    it('should route to applicantScreening.controller.create', function () {
      routerStub.post
        .withArgs('/', 'applicantScreeningCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/applicantScreenings/:id', function () {

    it('should route to applicantScreening.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'applicantScreeningCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/applicantScreenings/:id', function () {

    it('should route to applicantScreening.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'applicantScreeningCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/applicantScreenings/:id', function () {

    it('should route to applicantScreening.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'applicantScreeningCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
