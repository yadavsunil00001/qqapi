angular.module('qui.core')
  .factory('User', [
    'Session',
    function Auth(Session) {
      const userService = {
        userinfo: Session.read('userinfo'),
        states: Session.read('states'),
      };
      return userService;
    },
  ]);
