angular.module('qui.core')
  .constant('AUTH_EVENTS', {
    loginConfirmed: 'event:auth-loginConfirmed',
    loginCancelled: 'event:auth-loginCancelled',
    logoutConfirmed: 'event:auth-logoutConfirmed',
    loginRequired: 'event:auth-loginRequired',
    forbidden: 'event:auth-forbidden',
  })
  .factory('Auth', [
    '$http',
    '$q',
    'Session',
    'APP',
    function Auth($http, $q, Session, APP) {
      const authService = {};
      let refreshingToken = false;

      authService.login = function login(credentials) {
        return $http
          .post('/api/login', credentials, { ignoreAuthModule: true })
          .then(
            function signinSuccess(response) {
              return Session.create('oauth', response.data);
            },

            function signinFailure(response) {
              Session.destroy();
              const err = new Error(response.data.error);
              return $q.reject(err);
            }
          );
      };

      authService.refreshToken = function refreshToken() {
        // To Save Multiple Async RefreshToken Request
        if (refreshingToken) return $q.reject({ error: 'Multiple refresh request' });
        refreshingToken = true; // Set refresh_token reuqest tracker flag
        return $http
          .post(
            '/api/refresh',
            { refresh_token: Session.read('oauth').refresh_token },
            { ignoreAuthModule: true }
          )
          .then(function tokenRefreshed(response) {
            Session.create('oauth', response.data);
            refreshingToken = false; // reset refresh_token reuqest tracker flag
            return response.data;
          },

          function tokenRefreshError(response) {
            refreshingToken = false; // reset refresh_token reuqest tracker flag
            return $q.reject(response.data);
          });
      };

      authService.logout = function logout() {
        const url = '/api/logout';
        return $http
          .post(url, { access_token: Session.getAccessToken() })
          .then(
            function logoutSuccess(response) {
              // Destroy Session data
              Session.destroy();
              return response.data;
            },

            function logoutError(response) {
              Session.destroy();
              return $q.reject(response.data);
            }
          );
      };

      authService.forgotpass = function forgotpass(username) {
        const url = '/api/forgotpass';
        return $http
          .post(url, { username: username }, { ignoreAuthModule: true })
          .then(
            function forgotpassSuccess(response) {
              return response.data;
            },

            function forgotpassError(response) {
              return $q.reject(response.data);
            }
          );
      };

      authService.setSessionData = function gInfo() {
        return $q.all([
          $http
            .get(APP.apiServer + '/user')
            .then(function userinfoSuccess(response) {
              return Session.create('userinfo', response.data);
            }),

          $http
            .get(APP.apiServer + '/user/states')
            .then(function statesSuccess(response) {
              return Session.create('states', response.data);
            }),
        ]);
      };

      return authService;
    },
  ]);
