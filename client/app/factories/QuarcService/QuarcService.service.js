'use strict';

angular.module('uiGenApp')
  .service('QuarcService', function (Page, Session, Jobs,Regions,Degrees,Institutes,Industries,Employers,Skills,Funcs,JobComments, Summary) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      Page: Page,
      Session: Session,
      Jobs: Jobs,
      Regions:Regions,
      Degrees:Degrees,
      Institutes:Institutes,
      Industries:Industries,
      Employers:Employers,
      Skills:Skills,
      Funcs:Funcs,
      JobComments: JobComments,
      Summary: Summary

    };
  });
