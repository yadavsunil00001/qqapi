'use strict';

class NavigationJobsController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor() {
    }
}

angular.module('uiGenApp')
  .controller('NavigationJobsController', NavigationJobsController);
