angular.module('wmProfile.directives', [])
  .directive('wmpToggleGroup', ['jQuery',
    // Put an "active" class on only the last clicked element in a group
    function ($) {
      return {
        restrict: 'A',
        link: function ($scope, el, attrs) {
          var elTriggers = $(el).children();

          elTriggers.on('click', function (event) {
            // Set active class only on current button choice
            elTriggers.filter('.active').removeClass('active');
            $(this).addClass('active');
          });
        }
      };
    }
  ])
  .directive('wmpActivateChild', ['jQuery',
    // Put "active" class on child based on starting URL
    function ($) {
      return {
        restrict: 'AE',
        link: function ($scope, el, attrs, controller) {
          var elChildren = $(el).children();

          for (var i = 0, ii = elChildren.length; i < ii; i += 1) {
            var view = elChildren.eq(i).attr('href').split('#!/{{ WMP.username }}/')[1];

            if (window.location.hash.match(view)) {
              elChildren.eq(i).addClass('active');
              break;
            }
          }
        }
      };
    }
  ])
  .directive('wmpSortFilterBar', ['jQuery',
    // Pull in sorting and filtering commands from a button group and put choices on scope
    function ($) {
      return {
        restrict: 'AE',
        link: function (scope, el, attrs) {
          var elTriggers = $(el).children();

          elTriggers.on('click', function (event) {
            if ($(this).data('content-filter')) {
              scope.filterBy = {
                contentType: 'application/x-' + $(this).data('content-filter')
              };
            } else {
              delete scope.filterBy;
            }

            if ($(this).data('sort-id')) {
              scope.sortOrder = $(this).data('sort-id');
            } else {
              delete scope.sortOrder;
            }

            scope.$apply();
          });
        }
      };
    }
  ]);
