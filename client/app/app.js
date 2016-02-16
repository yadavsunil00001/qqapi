'use strict';
angular.module('uiGenApp', [
  'uiGenApp.constants',
  'qui.core',
  'qui.hire',
  'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'mwl.calendar',
  'chart.js',
])
  .constant('APP_CONFIG',{QUARC_API_URL:location.origin+'/api'})
  .config(function($urlRouterProvider, $locationProvider,RestangularProvider,APP_CONFIG) {
    RestangularProvider.setBaseUrl(APP_CONFIG.QUARC_API_URL);
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });

// Temporary declaration - Need to fix
angular.module('qui.hire', [
  'qui.core',
  'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'mwl.calendar',
  'chart.js',
  'restangular'
]);
