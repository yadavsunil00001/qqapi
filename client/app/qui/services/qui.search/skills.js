angular.module('qui.search')
  .factory('Skills', [
    '$http',
    '$q',
    'APP',
    function Jobs($http, $q, APP) {
      const skillService = {};

      skillService.get = function getSkills(params) {
        const url = `${APP.apiServer}/search/skills`;
        return $http
          .get(url, { params: params })
          .then(
            function successSkills(response) {
              return response.data;
            },

            function errorSkills(response) {
              return $q.reject(response.data);
            }
          );
      };

      skillService.create = function createSkill(data) {
        const url = `${APP.apiServer}/skills`;
        return $http
          .post(url, data)
          .then(
            function createdSkills(response) {
              return response.data;
            },

            function failledCreation(response) {
              return $q.reject(response.data);
            }
          );
      };

      return skillService;
    },
  ]);
