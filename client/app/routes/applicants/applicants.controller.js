'use strict';

angular.module('uiGenApp')
  .controller('ApplicantsCtrl', function ($scope, QuarcService, Restangular, $stateParams) {
    const Page  = QuarcService.Page;

    const vm = this;
    vm.buckets = ['Pending Feedback', 'Shortlisted', 'Rejected', 'All', 'Interview'];

    // Set default bucket to ALL
    if (!~vm.buckets.indexOf($stateParams.bucket)) $stateParams.bucket = 'All';

    Page.setTitle(`${$stateParams.bucket} Applicants`);

    vm.applicants = []; // collection of applicants
    vm.ui = { lazyLoad: true, loading: false }; // ui states
    vm.params = { offset: 0, limit: 15, fl: 'id,name,state_id,state_name,_root_,client_name,exp_designation' }; // GET query params

    vm.loadApplicants = function loadApplicants() {
      if (!vm.ui.lazyLoad) return; // if no more applicants to get
      vm.ui = { lazyLoad: false, loading: true };

      if ($stateParams.bucket === 'Interview') {
        vm.params.interview_time = [
          moment().startOf('day').toISOString(),
          moment().startOf('day').add(1, 'months').toISOString(),
        ].join(',');
        vm.params.fl += ',interview_time,interview_type';
      } else {
        vm.params.state_id = $stateParams.bucket.replace(' ', '_').toUpperCase();
      }

      Restangular.all('applicants').getList(vm.params).then(function(applicants){
        angular.forEach(applicants, function iterateJobs(applicant) {
          vm.applicants.push(applicant);
        });

        // data has been loaded
        vm.ui.loading = false;

        // check for returned results count and set lazy loadLoad false if less
        vm.ui.lazyLoad = angular.equals(applicants.length, vm.params.limit) ? true : false;

        // increment offset for next loading of results
        vm.params.offset = vm.params.offset + vm.params.limit;

      })

      vm.loadApplicants();
    };

    vm.loadApplicants();
  });
