'use strict';

angular.module('uiGenApp')
  .service('QuarcService', function (Page, Session, User) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      Page: Page,
      Session: Session,
      User: User
    };
  });
