'use strict';

angular.module('uiGenApp')
  .controller('CalendarCtrl', function (QuarcService, Restangular, $scope, moment, $state) {
    const Applicants = QuarcService.Applicants;
    const Page = QuarcService.Page;

    const vm = this;
    Page.setTitle('Scheduled Interview Calendar');
    vm.colors = { 5: 'success', 8: 'warning', 17: 'info' };
    vm.applicants = []; // collection of applicants
    vm.ui = { lazyLoad: true, loading: false }; // ui states

    // GET query params
    vm.params = {
      start: 0, rows: 30,
      fl: 'id,name,state_id,state_name,interview_time,interview_type,_root_',
    };

    vm.calendarView = 'month';
    vm.calendarDay = moment().toDate();
    $scope.$watch(function calendarDay() {
      // watch for change of start of month
      return moment(vm.calendarDay).startOf('month').toISOString();
    }, function calendarDayWatch() {
      // Reset controller variables to default
      vm.applicants = [];
      vm.ui = { lazyLoad: true, loading: false };
      vm.params.start = 0; // Reset result offset
      vm.loadApplicants();
    }, true);

    vm.isCellOpen = true;
    vm.loadApplicants = function loadApplicants() {
      if (!vm.ui.lazyLoad) return; // if no more applicants to get
      vm.ui = { lazyLoad: false, loading: true };

      // set interview_time range using latest calendar day
      vm.params.interview_time = [
        //moment(vm.calendarDay).startOf('month').toISOString()
        '2016-01-01T18:30:00.000Z',
        moment(vm.calendarDay).endOf('month').toISOString(),
      ].join(',');
      Restangular
        .one('applicants')
        .get(vm.params)
        .then(function applicants(result) {
        angular.forEach(result, function iterateApplicants(applicant) {
          vm.applicants.push({
            title: `
                <a href="${$state.href('app.jobs.manage', { jobId: applicant._root_.id }) }" target="_blank">
                  <span class="text-${vm.colors[applicant.interview_type]}-lter">${applicant._root_.role}</span>
                </a> –
                <a href="${$state.href('app.applicant.view', { applicantId: applicant.id })}" target="_blank">
                  <span class="text-${vm.colors[applicant.interview_type]}-lter">${applicant.name}</span>
                </a>
                <div class="label label-${vm.colors[applicant.interview_type]}">${applicant.state_name}</div>
              `,
            type: vm.colors[applicant.interview_type],
            startsAt: moment(applicant.interview_time).toDate(),
            endsAt: moment(applicant.interview_time).add(1, 'hours').toDate(),
          });
        });

        // data has been loaded
        vm.ui.loading = false;

        // check for returned results count and set lazy loadLoad false if less
        vm.ui.lazyLoad = angular.equals(result.length, vm.params.rows) ? true : false;

        // increment offset for next loading of results
        vm.params.start = vm.params.start + vm.params.rows;
        vm.loadApplicants();
      });
    };
  });
