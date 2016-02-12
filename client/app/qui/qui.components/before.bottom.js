angular.module('qui.components', [])
  .directive('beforeBottom', [
    '$window',
    '$document',
    function beforeBottom($window, $document) {
      return function link(scope, elm, attr) {
        angular.element($window).bind('scroll', function scroll() {
          const windowHeight = 'innerHeight' in $window ? $window.innerHeight : $document.documentElement.offsetHeight;
          const body = $document[0].body;
          const html = $document[0].documentElement;
          const docHeight = Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
          );
          const windowBottom = windowHeight + $window.pageYOffset;
          if (windowBottom + 150 >= docHeight) {
            scope.$apply(attr.beforeBottom);
          }
        });
      };
    },
  ]);
