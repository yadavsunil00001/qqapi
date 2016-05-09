

var proxyquire = require('proxyquire').noPreserveCache();

var educationCtrlStub = {
  index: 'educationCtrl.index',
  show: 'educationCtrl.show',
  create: 'educationCtrl.create',
  update: 'educationCtrl.update',
  destroy: 'educationCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var educationIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './education.controller': educationCtrlStub,
});

describe('Education API Router:', function () {

  it('should return an express router instance', function () {
    educationIndex.should.equal(routerStub);
  });

  describe('GET /api/educations', function () {

    it('should route to education.controller.index', function () {
      routerStub.get
        .withArgs('/', 'educationCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/educations/:id', function () {

    it('should route to education.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'educationCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/educations', function () {

    it('should route to education.controller.create', function () {
      routerStub.post
        .withArgs('/', 'educationCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/educations/:id', function () {

    it('should route to education.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'educationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/educations/:id', function () {

    it('should route to education.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'educationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/educations/:id', function () {

    it('should route to education.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'educationCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
