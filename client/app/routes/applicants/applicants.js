'use strict';

angular.module('uiGenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('applicants', {
        url: '/applicants/:bucket',
        templateUrl: 'app/routes/applicants/applicants.html',
        controller: 'ApplicantsCtrl',
        controllerAs: 'Applicant'
      });
  });
