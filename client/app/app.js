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
  .constant('ENUMS', {
    STATES: ['Tasks', 'Shortlisted', 'Feedback', 'Rejected', 'All']
  })
  // Todo: Unify Constants in Server and Client
  .constant('CONSTANTS', {
    STAKEHOLDERS: {
      2: 'CONSULTANTS',
      4: 'QUEZX',
      5: 'CLIENTS',
      6: 'QUEZX',
      8: 'QUEZX',
      9: 'QUEZX',
      10: 'QUEZX',
      11: 'QUEZX',
      12: 'QUEZX',
    },
    BUCKETS:{
    CLIENTS: {
      ALL: [
        10, 15, 20, 30, 25, 23, 9, 4, 1, 16, 19, 21, 24,
        22, 8, 17, 5, 28, 12, 29, 31, 26, 18, 2, 3, 11, 14, 33, 35,
      ],
      PENDING_FEEDBACK: [
        25, 23, 9, 4, 1, 16, 26,
      ],
      SHORTLISTED: [
        19, 21, 24, 22, 8, 17, 5, 12, 33,
      ],
      REJECTED: [
        18, 2, 3, 11, 14,
      ],
    },
    CONSULTANTS: {
      ALL: [
        24, 22, 6, 19, 8, 5, 17, 12, 21, 23, 25, 9, 4, 10,
        15, 20, 28, 29, 30, 31, 13, 14, 2, 3, 18, 11, 27,
        1, 16, 26, 32, 33,
      ],
      TASKS: [
        24, 22, 6, 19, 8, 5, 17, 12, 21,
      ],
      SHORTLISTED: [
        24, 22, 19, 8, 5, 17, 12, 21, 23, 25, 9, 4, 10, 15, 20, 28, 29, 30, 31, 33,
      ],
      FEEDBACK: [
        23, 25, 9, 4, 27, 1, 16, 26,
      ],
      REJECTED: [
        13, 14, 2, 3, 18, 11,
      ],
    },
    QUEZX: {
      ALL: [
        10, 15, 20, 30, 25, 23, 9, 4, 1, 16, 19, 21, 24,
        22, 8, 17, 5, 28, 12, 29, 31, 26, 18, 2, 3, 11, 14, 33,
      ],
      PENDING_FEEDBACK: [
        25, 23, 9, 4, 1, 16, 26,
      ],
      SHORTLISTED: [
        19, 21, 24, 22, 8, 17, 5, 12, 33,
      ],
      REJECTED: [
        18, 2, 3, 11, 14,
      ],
    },
  }})
  .config(function($urlRouterProvider, $locationProvider,RestangularProvider,APP_CONFIG) {
    RestangularProvider.setBaseUrl(APP_CONFIG.QUARC_API_URL);
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });


