angular
  .module('qui.core')
  .factory('AuthInterceptor', [
    '$rootScope',
    '$q',
    'AUTH_EVENTS',
    'Session',
    function AuthIterceptor($rootScope, $q, AUTH_EVENTS, Session) {
      return {
        request: function request(config) {
          if (Session.isAuthenticated()) {
            config.headers.Authorization = 'Bearer ' + Session.getAccessToken();
          }

          return config;
        },
      };
    },
  ])
  .config([
    '$httpProvider',
    function httpIntercept($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
    },
  ]);
