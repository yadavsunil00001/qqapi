angular.module('uiGenApp')
  .controller('JobViewController',
    function JobViewCtrl(QuarcService, Restangular, $stateParams, $sce) {
      const Jobs = QuarcService.Jobs;
      const Page = QuarcService.Page;

      const vm = this;
      vm.data = {};
      vm.loadJob = function loadJob() {
        vm.ui = { loading: true };
        Restangular
          .one('jobs',$stateParams.jobId)
          .get()
          .then(function gotJob(result) {
            Page.setTitle(`${result.role} - ${result.client_name}`);
            vm.data = result;
            vm.responsibility = $sce.trustAsHtml(result.responsibility);
            vm.interview_addr = $sce.trustAsHtml(result.interview_addr);

            // data has been loaded
            vm.ui.loading = false;
          });
      };

      vm.loadJob();
    });
