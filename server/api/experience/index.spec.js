

var proxyquire = require('proxyquire').noPreserveCache();

var experienceCtrlStub = {
  index: 'experienceCtrl.index',
  show: 'experienceCtrl.show',
  create: 'experienceCtrl.create',
  update: 'experienceCtrl.update',
  destroy: 'experienceCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var experienceIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './experience.controller': experienceCtrlStub,
});

describe('Experience API Router:', function () {

  it('should return an express router instance', function () {
    experienceIndex.should.equal(routerStub);
  });

  describe('GET /api/experiences', function () {

    it('should route to experience.controller.index', function () {
      routerStub.get
        .withArgs('/', 'experienceCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/experiences/:id', function () {

    it('should route to experience.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'experienceCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/experiences', function () {

    it('should route to experience.controller.create', function () {
      routerStub.post
        .withArgs('/', 'experienceCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/experiences/:id', function () {

    it('should route to experience.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'experienceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/experiences/:id', function () {

    it('should route to experience.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'experienceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/experiences/:id', function () {

    it('should route to experience.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'experienceCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
