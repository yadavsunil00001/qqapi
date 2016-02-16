'use strict';

angular.module('uiGenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('job', {
        abstract: true,
        url: '/job',
        templateUrl: '<div ui-view class="fade-in-right-big smooth"></div>',
        controller: 'JobCtrl'
      })
      .state('job.view', {
        url: '/{jobId}',
        templateUrl: 'app/routes/job/view/view.html',
      });
  });
