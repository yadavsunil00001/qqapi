

var proxyquire = require('proxyquire').noPreserveCache();

var degreeCtrlStub = {
  index: 'degreeCtrl.index',
  show: 'degreeCtrl.show',
  create: 'degreeCtrl.create',
  update: 'degreeCtrl.update',
  destroy: 'degreeCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var degreeIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './degree.controller': degreeCtrlStub,
});

describe('Degree API Router:', function () {

  it('should return an express router instance', function () {
    degreeIndex.should.equal(routerStub);
  });

  describe('GET /api/degrees', function () {

    it('should route to degree.controller.index', function () {
      routerStub.get
        .withArgs('/', 'degreeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/degrees/:id', function () {

    it('should route to degree.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'degreeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/degrees', function () {

    it('should route to degree.controller.create', function () {
      routerStub.post
        .withArgs('/', 'degreeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/degrees/:id', function () {

    it('should route to degree.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'degreeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/degrees/:id', function () {

    it('should route to degree.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'degreeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/degrees/:id', function () {

    it('should route to degree.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'degreeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
