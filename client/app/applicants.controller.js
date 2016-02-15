'use strict';

angular.module('uiGenApp')
  .controller('AppController', function ($window, $uibModal, Session, User, Applicants, Page, $state, $rootScope) {
    const vm = this;

    // config
    vm.app = {
      name: 'QUEZX',
      version: '0.0.1',
      settings: {
        themeID: 1,
        navbarHeaderColor: 'bg-white',
        navbarCollapseColor: 'bg-white-only',
        asideColor: 'bg-black',
        headerFixed: true,
        asideFixed: true,
        asideFolded: true,
        asideDock: true,
        container: false,
        offScreen: false, // flag for show of sidebar for mobile view
        mobileHeader: false, // flag to show header Nav and Search in mobile view
      },
    };

    // keeps track of state change and hides sidebar view for mobile
    /* eslint angular/on-watch: 0 */
    $rootScope.$on('$stateChangeStart', function handleStateChange() {
      vm.app.settings.offScreen = false;
      vm.app.settings.mobileHeader = false;
    });

    vm.Page = Page; // Set Page title

    // Applicant search related Functions
    vm.Applicants = {
      select: function gotoApplicant($item) {
        vm.Applicants.searchText = '';
        $state.go('applicant.view', { applicantId: $item.id });
      },

      get: function searchApplicants(searchText) {
        return Applicants
          .get({ start: 0, rows: 15, fl: 'id,name', q: searchText })
          .then(function gotApplicants(response) {
            return response.map(function iterate(value) {
              return value;
            });
          });
      },

      noResults: false,
      loadingRegions: false,
    };

    vm.interviewUI = {
      5: {
        icon: 'phone',
        color: 'success',
      },
      8: {
        icon: 'user',
        color: 'warning',
      },
      17: {
        icon: 'skype',
        color: 'info',
      },
    };

    vm.userinfo = User.userinfo;
    vm.states = User.states;
    vm.showNavJobs = function showNavJobs() {
      return $state.is('applicants') || $state.is('jobs.manage');
    };

    vm.downloadApplicant = function downloadApplicant(ids) {
      // ApplicantIds is array contatining applicant id to download cvs
      const modalInstance = $uibModal.open({
        templateUrl: 'html/modal.download.cv.html',
        controller: 'DownloadCVController',
        controllerAs: 'DownloadCV',
        size: 'sm',
        resolve: {
          ApplicantIds: function ApplicantIds() {
            return ids;
          },
        },
      });

      modalInstance.result.then(function success() {
        // console.log(type);
      });
    };

    vm.addFollower = function addFollower(follower, applicantId) {
      // ApplicantIds is array contatining applicant id to download cvs
      const modalInstance = $uibModal.open({
        templateUrl: 'html/modal.add.follower.html',
        controller: 'AddFollowerController',
        controllerAs: 'AddFollower',
        size: 'md',
        resolve: {
          FollowerData: function FollowerData() {
            return follower[0];
          },

          ApplicantId: function ApplicantId() {
            return applicantId;
          },
        },
      });

      modalInstance.result.then(function success() {
        // console.log(type);
      });
    };

    vm.changeState = function changeState(applicant, stateId) {
      // ApplicantIds is array contatining applicant id to download cvs
      const modalInstance = $uibModal.open({
        templateUrl: 'html/modal.change.state.html',
        controller: 'ChangeStateController',
        controllerAs: 'ChangeState',
        bindToController: 'true',
        size: 'md',
        resolve: {
          applicant: applicant,
          state_id: stateId,
        },
      });

      modalInstance.result.then(function success(data) {
        applicant.state_id = data.state_id;
        applicant.state_name = vm.states[data.state_id].name;
      });
    };
  });
