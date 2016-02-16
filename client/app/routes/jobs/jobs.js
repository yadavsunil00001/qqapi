'use strict';

angular.module('uiGenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('jobs', {
        abstract: true,
        url: '/jobs',
        templateUrl: 'app/routes/jobs/jobs.html',
        controller: 'JobsCtrl'
      })
      .state('jobs.new', {
        url: '/new',
        templateUrl: 'app/routes/jobs/new/new.html',
      })
      .state('jobs.list', {
        url: '/',
        templateUrl: 'app/routes/jobs/list/list.html',
      })
      .state('jobs.manage', {
        url: '/manage/{bucket}/{jobId}',
        templateUrl: 'app/routes/jobs/manage/manage.html',
        //controller: 'LoginController',
        //controllerAs: 'vm',
        authenticate: true
      });
  });


