angular.module('qui.search')
  .factory('Industries', [
    '$http',
    '$q',
    'APP',
    function Jobs($http, $q, APP) {
      const industryService = {};

      industryService.get = function getIndustries(params) {
        const url = `${APP.apiServer}/search/industries`;
        return $http
          .get(url, { params: params })
          .then(
            function successIndustries(response) {
              return response.data;
            },

            function errorIndustries(response) {
              return $q.reject(response.data);
            }
          );
      };

      return industryService;
    },
  ]);
