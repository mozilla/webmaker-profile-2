angular.module('wmProfile.directives', [])
  .directive('ngClick', function () {
    // Prevent default on all elements that have ngClick defined
    return {
      restrict: 'A',
      link: function (scope, el, attrs) {
        if (attrs.href === '#') {
          el.on('click', function (e) {
            e.preventDefault();
          });
        }
      }
    };
  })
  .directive('appVersion', ['version',
    function (version) {
      return function (scope, elm, attrs) {
        elm.text(version);
      };
    }
  ]);
