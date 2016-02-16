angular.module('qui.hire')
  .controller('JobCommentsController', function JobCommentsCtrl(QuarcService, $stateParams) {
    const JobComments = QuarcService.JobComments;
    const User = QuarcService.User;

      const vm = this;
      vm.loadJobComments = function loadJobComments() {
        vm.ui = { loading: true, scrollToBottom: false };
        Restangular
          .one('jobs', $stateParams.jobId)
          .all('comments')
          .then(function gotJobComment(result) {
            vm.data = result;

            // data has been loaded
            vm.ui = { loading: false, scrollToBottom: true };
          });
      };

      vm.insert = function insertComment() {
        const comment = vm.post.comment;
        vm.ui = { loading: true, scrollToBottom: false };
        Restangular
          .one('jobs', $stateParams.jobId)
          .all('comments')
          .post({ comment: comment })
          .then(function insertedComment() {
            vm.post.comment = '';
            vm.data.push({
              user: { name: User.userinfo.name },
              body: comment,
              created_at: new Date().toISOString(),
            });

            // data has been loaded
            vm.ui = { loading: false, scrollToBottom: true };
          });
      };

      vm.loadJobComments();
    });
