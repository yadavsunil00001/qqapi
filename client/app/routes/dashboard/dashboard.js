'use strict';

angular.module('uiGenApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/',
        templateUrl: 'app/routes/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'Dashboard'
      });
  });
