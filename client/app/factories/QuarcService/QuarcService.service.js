'use strict';

angular.module('uiGenApp')
  .service('QuarcService', function (Page) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var Page = Page;
    return {
      Page: Page,
    };
  });
