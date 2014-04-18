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
  .directive('wmpSortOrder', ['jQuery',
    function ($) {
      return {
        restrict: 'AE',
        link: function (scope, el, attrs) {
          var elTriggers = $(el).children();

          elTriggers.on('click', function (event) {
            event.preventDefault();

            // Set active class only on current button choice
            elTriggers.filter('.active').removeClass('active');
            $(this).addClass('active');

            var sortID = $(this).data('sort-id');

            scope.sortOrder = sortID;
            scope.$apply();
          });
        }
      };
    }
  ])
  .directive('appVersion', ['version',
    function (version) {
      return function (scope, elm, attrs) {
        elm.text(version);
      };
    }
  ]);
