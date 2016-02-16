'use strict';

describe('Controller: ApplicantCtrl', function () {

  // load the controller's module
  beforeEach(module('uiGenApp'));

  var ApplicantCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApplicantCtrl = $controller('ApplicantCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
