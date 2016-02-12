angular.module('qui.search')
  .factory('Employers', [
    '$http',
    '$q',
    'APP',
    function Jobs($http, $q, APP) {
      const employerService = {};

      employerService.get = function getEmployers(params) {
        const url = `${APP.apiServer}/search/employers`;
        return $http
          .get(url, { params: params })
          .then(
            function successEmployers(response) {
              return response.data;
            },

            function errorEmployers(response) {
              return $q.reject(response.data);
            }
          );
      };

      return employerService;
    },
  ]);
