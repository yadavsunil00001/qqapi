

var proxyquire = require('proxyquire').noPreserveCache();

var clientPaymentCtrlStub = {
  index: 'clientPaymentCtrl.index',
  show: 'clientPaymentCtrl.show',
  create: 'clientPaymentCtrl.create',
  update: 'clientPaymentCtrl.update',
  destroy: 'clientPaymentCtrl.destroy',
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
var clientPaymentIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    },
  },
  './clientPayment.controller': clientPaymentCtrlStub,
});

describe('ClientPayment API Router:', function () {

  it('should return an express router instance', function () {
    clientPaymentIndex.should.equal(routerStub);
  });

  describe('GET /api/clientPayments', function () {

    it('should route to clientPayment.controller.index', function () {
      routerStub.get
        .withArgs('/', 'clientPaymentCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/clientPayments/:id', function () {

    it('should route to clientPayment.controller.show', function () {
      routerStub.get
        .withArgs('/:id', 'clientPaymentCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/clientPayments', function () {

    it('should route to clientPayment.controller.create', function () {
      routerStub.post
        .withArgs('/', 'clientPaymentCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/clientPayments/:id', function () {

    it('should route to clientPayment.controller.update', function () {
      routerStub.put
        .withArgs('/:id', 'clientPaymentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/clientPayments/:id', function () {

    it('should route to clientPayment.controller.update', function () {
      routerStub.patch
        .withArgs('/:id', 'clientPaymentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/clientPayments/:id', function () {

    it('should route to clientPayment.controller.destroy', function () {
      routerStub.delete
        .withArgs('/:id', 'clientPaymentCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
