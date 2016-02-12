'use strict';

angular.module('uiGenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('applicants', {
        url: '/applicants',
        templateUrl: 'app/routes/applicants/applicants.html',
        controller: 'ApplicantsCtrl'
      });
  });
