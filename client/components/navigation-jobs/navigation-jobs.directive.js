'use strict';

angular.module('uiGenApp')
  .directive('navigationJobs', function () {
    return {
      templateUrl: 'components/navigation-jobs/navigation-jobs.html',
      restrict: 'EA',
      controller: 'NavigationJobsController',
      controllerAs: 'navigationJobs'
    };
  });
