'use strict';

angular.module('uiGenApp')
  .controller('NavigationJobsController', function(Restangular){
    const vm = this;
    vm.jobs = []; // collection of jobs
    vm.ui = { lazyLoad: true, loading: false }; // ui states
    vm.params = { offset: 0, limit: 15 }; // GET query params
    vm.loadJobs = function loadJobs() {
      if (!vm.ui.lazyLoad) return; // if no more jobs to get
      vm.ui = { lazyLoad: false, loading: true };
      Restangular.all('jobs').getList(vm.params).then(function(jobs) {
        angular.forEach(jobs, function iterateJobs(job) {
          vm.jobs.push(job);
        });

        // data has been loaded
        vm.ui.loading = false;

        // check for returned results count and set lazy loadLoad false if less
        vm.ui.lazyLoad = angular.equals(jobs.length, vm.params.limit) ? true : false;

        // increment offset for next loading of results
        vm.params.offset = vm.params.offset + vm.params.limit;

        vm.loadJobs();
      });
    };

    vm.loadJobs();
  });
