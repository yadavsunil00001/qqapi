angular.module('qui.search')
  .factory('Funcs', [
    '$http',
    '$q',
    'APP',
    function Jobs($http, $q, APP) {
      const funcService = {};

      funcService.get = function getFuncs(params) {
        const url = `${APP.apiServer}/search/funcs`;
        return $http
          .get(url, { params: params })
          .then(
            function successFuncs(response) {
              return response.data;
            },

            function errorFuncs(response) {
              return $q.reject(response.data);
            }
          );
      };

      return funcService;
    },
  ]);
