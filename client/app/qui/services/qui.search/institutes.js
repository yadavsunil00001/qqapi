angular.module('qui.search')
  .factory('Institutes', [
    '$http',
    '$q',
    'APP',
    function Jobs($http, $q, APP) {
      const instituteService = {};

      instituteService.get = function getInstitutes(params) {
        const url = `${APP.apiServer}/search/institutes`;
        return $http
          .get(url, { params: params })
          .then(
            function successInstitutes(response) {
              return response.data;
            },

            function errorInstitutes(response) {
              return $q.reject(response.data);
            }
          );
      };

      return instituteService;
    },
  ]);
