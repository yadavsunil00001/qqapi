angular.module('qui.core')
  .factory('Page', [
    function Page() {
      let title = 'Welcome';
      return {
        title: function getTitle() {
          return title + " | QuezX.com";
        },

        setTitle: function setTitle(newTitle) {
          title = newTitle;
        },
      };
    },
  ]);
