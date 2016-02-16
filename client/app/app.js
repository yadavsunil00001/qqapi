'use strict';

angular.module('qui.components', [])

angular
  .module('qui.core', [
    'qui.components',
    'http-auth-interceptor',
  ])
  .constant('MODULE_VERSION', '0.0.1')
  // this configs to initiated using provider
  .constant('APP', {
    apiServer: '//api.quezx.dev',
    accountsServer: '//accounts.quezx.dev',
    hireServer: '//hire.quezx.dev',
    partnerServer: '//partner.quezx.dev',
    hireLogin: '//accounts.quezx.dev/authorise?client_id=hirequezx&response_type=code&' +
    'redirect_uri=http://hire.quezx.dev/access/oauth&state=yo',
    partnerLogin: '//accounts.quezx.dev/authorise?client_id=partnerquezx&response_type=code&' +
    'redirect_uri=http://partner.quezx.dev/access/oauth&state=yo',
  })


angular.module('uiGenApp', [
  'qui.core',
  'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'mwl.calendar',
  'chart.js',
  'restangular'
])
  .constant('APP_CONFIG',{QUARC_API_URL:location.origin+'/api'})
  .config(function($urlRouterProvider, $locationProvider,RestangularProvider,APP_CONFIG) {
    RestangularProvider.setBaseUrl(APP_CONFIG.QUARC_API_URL);
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });


