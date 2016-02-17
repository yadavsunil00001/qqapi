'use strict';

angular.module('uiGenApp')
  .service('QuarcService', function (ENUMS, APP_CONFIG, Page, Session, User) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      ENUMS: ENUMS,
      Page: Page,
      Session: Session,
      User: User
    };
  });
