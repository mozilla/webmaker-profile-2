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
  ])
  .directive('wmpLinkCollector', ['jQuery',
    function ($) {
      return {
        restrict: 'AE',
        scope: true,
        templateUrl: 'partials/link-collector.html',
        link: function ($scope, el, attrs, controller) {
          var elWrapper = $(el),
            elInput = elWrapper.find('.link-form input');

          function shortName(targetURL) {
            var title = targetURL.split('//')[1];

            var socialMediaRegex = {
              twitter: /^(?:www.)?twitter.com\//,
              tumblr: /^[a-zA-Z]*.tumblr.com/,
              facebook: /^(?:www.)?facebook.com\//,
              googlePlus: /^plus.google.com\//
            };

            if (title.match(socialMediaRegex.twitter)) {
              return 'twitter';
            }

            if (title.match(socialMediaRegex.tumblr)) {
              return 'tumblr';
            }

            if (title.match(socialMediaRegex.facebook)) {
              return 'facebook';
            }

            if (title.match(socialMediaRegex.googlePlus)) {
              return 'google-plus';
            }

            // If the URL doesn't match common social services, just use it verbatim
            return null;
          }

          $scope.linkList = [];
          $scope.showInvalid = false;
          $scope.showDuplicate = false;

          $scope.addLink = function () {
            if (!$scope.personalLinks.link.$valid) {
              $scope.showInvalid = true;
              return;
            } else {
              $scope.showInvalid = false;
            }

            // Don't add empty or null strings
            if (!$scope.userLink || $scope.userLink.trim() === '') {
              return;
            }

            // Don't allow duplicate URLs
            if ($scope.linkList.length) {
              for (var i = $scope.linkList.length - 1; i >= 0; i--) {
                if ($scope.userLink === $scope.linkList[i].url) {
                  $scope.showDuplicate = true;
                  return;
                }
              }

              $scope.showDuplicate = false;
            }

            if ($scope.userLink) {
              $scope.linkList.push({
                url: $scope.userLink,
                service: shortName($scope.userLink)
              });

              elInput.val(null);
            }
          };

          $scope.removeLink = function (id) {
            $scope.linkList.splice(id, 1);
          };

          // Add links when enter is pressed
          elInput.on('keypress', function (event) {
            if (event.keyCode === 13) {
              event.preventDefault();
              $scope.addLink();
              $scope.$apply();
            }
          });

        }
      };
    }
  ]);
