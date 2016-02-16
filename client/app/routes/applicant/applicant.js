'use strict';

angular.module('uiGenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('applicant', {
        abstract: true,
        url: '/applicant',
        templateUrl: '<div ui-view class="fade-in-right-big smooth"></div>',
        controller: 'ApplicantCtrl'
      })
      .state('applicant.view', {
        url: '/{applicantId}',
        templateUrl: 'app/routes/applicant/view/view.html',
      });
  });
