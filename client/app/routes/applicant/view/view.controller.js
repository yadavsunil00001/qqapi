angular.module('qui.hire')
  .controller('ApplicantViewController', function ApplicantViewCtrl(QuarcService, Restangular, $stateParams, APP_CONFIG, $sce) {
      Page = QuarcService.Page;
      Session = QuarcService.Session;

      const vm = this;
      vm.data = {};
      vm.trustSrc = function trustSrc(src) {
        return $sce.trustAsResourceUrl(src);
      };

      vm.resumeSrc = `${APP_CONFIG.QUARC_API_URL}/applicants/${$stateParams.applicantId}/resume?access_token=${Session.getAccessToken()}`;
      vm.loadApplicant = function loadApplicant() {
        vm.ui = { loading: true };
        Restangular
          .one('applicants')
          .get($stateParams.applicantId)
          .then(function gotApplicant(result) {
            vm.data = result;
            Page.setTitle(vm.data.name);

            // Loading Followers
            Restangular
              .one('followers')
              .get($stateParams.applicantId)
              .then(function gotFollower(fresult) {
                vm.data.follower = fresult;
              });

            // data has been loaded
            vm.ui.loading = false;
          });
      };

      vm.loadApplicant();
    });
