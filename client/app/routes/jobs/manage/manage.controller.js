angular.module('uiGenApp')
  .controller('JobsManageController', function JobsManageCtrl(QuarcService, Restangular, $stateParams, $filter, moment) {
    const Page = QuarcService.Page;
    const ENUMS  = QuarcService.ENUMS;

    const vm = this;
      vm.buckets = ENUMS.STATES;

      // Set default bucket to ALL
      if (!~vm.buckets.indexOf($stateParams.bucket)) $stateParams.bucket = 'All';
      vm.applicants = []; // collection of applicants
      vm.job = {}; // Job applied by applicant initialized
      vm.ui = { lazyLoad: true, loading: false }; // ui states
      vm.params = {
        offset: 0, limit: 15,
        fl: 'applicant_score,created_on,edu_degree,exp_designation,exp_employer,exp_location,exp_salary,id,name,state_id,state_name,total_exp',
      }; // GET query params
      vm.loadApplicants = function loadApplicants() {
        if (!vm.ui.lazyLoad) return; // if no more jobs to get
        vm.ui = { lazyLoad: false, loading: true };

        if ($stateParams.bucket === 'Interview') {
          // Customization for Interview tab
          vm.params.interview_time = [
            moment().startOf('day').toISOString(),
            moment().startOf('day').add(1, 'months').toISOString(),
          ].join(',');
          vm.params.fl += ',interview_time,interview_type';
        } else {
          vm.params.state_id = $stateParams.bucket.replace(' ', '_').toUpperCase();
        }

        Restangular
          .one('jobs',$stateParams.jobId)
          .all('applicants')
          .getList()
          .then(function applicantsList(result) {
            angular.forEach(result, function iterateApplicants(applicant) {
              vm.applicants.push(applicant);
            });

            // data has been loaded
            vm.ui.loading = false;

            // check for returned results count and set lazy loadLoad false if less
            vm.ui.lazyLoad = angular.equals(result.length, vm.params.limit) ? true : false;

            // increment offset for next loading of results
            vm.params.offset = vm.params.offset + vm.params.limit;
          });
      };

      vm.loadApplicants(); // get applicants

      vm.loadJob = function loadJob() {
        Restangular
          .one('jobs',$stateParams.jobId)
          .get({ fl: 'id,role' })
          .then(function getJob(response) {
            vm.job = response;
            Page.setTitle(`${vm.job.role} - ${$stateParams.bucket} Applicants`); // set page title
          });
      };

      vm.loadJob(); // get job details

      // returns array containing resultkey of search result
      vm.getApplicants = function getApplicant(criteria = {}, returnkey = 'id') {
        return $filter('filter')(vm.applicants, criteria)
          .map(function checkedApplicant(applicant) {
            return applicant[returnkey];
          });
      };

      // sets value
      vm.setChecked = function setChecked(state) {
        angular.forEach(vm.applicants, function checked(value, key) {
          vm.applicants[key].checked = state;
        });
      };
    });
