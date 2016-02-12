angular.module('qui.search')
  .factory('Regions', [
    '$http',
    '$q',
    'APP',
    function Jobs($http, $q, APP) {
      const regionService = {};

      regionService.get = function getRegions(params) {
        const url = `${APP.apiServer}/search/regions`;
        return $http
          .get(url, { params: params })
          .then(
            function successRegions(response) {
              return response.data;
            },

            function errorRegions(response) {
              return $q.reject(response.data);
            }
          );
      };

      return regionService;
    },
  ]);
