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
  .directive('wmpSrc', ['jQuery',
    function (jQuery) {
      // Add wmp-src to an img to only give it a src if the target is loadable
      // This prevents broken images from displaying and creates hooks for other display logic
      return {
        restrict: 'A',
        scope: {
          url: '@wmpSrc',
          didFail: '=wmpSrcFailed'
        },
        link: function ($scope, el, attrs) {
          var elLoader = jQuery('<img>');
          el.fadeTo(0, 0);

          elLoader.on('load', function () {
            el.attr('src', $scope.url).fadeTo(200, 1);
            $scope.didFail = false;
            $scope.$apply();
          });

          elLoader.on('error', function () {
            $scope.didFail = true;
            $scope.$apply();
          });

          // Attempt to load target image in a non attached IMG element
          elLoader.attr('src', $scope.url);
        }
      };
    }
  ])
  .directive('wmpLogin', ['$rootScope',
    function ($rootScope) {
      return {
        restrict: 'E',
        scope: false,
        templateUrl: '/user/_partials/login.html',
        link: function ($scope, el, attrs) {
          $scope.userInfo = undefined;
          $scope.userLoggedIn = false; // No user info means not logged in

          $rootScope.$on('login', function (user) {
            $scope.userLoggedIn = true;
            $scope.userInfo = user;
            $scope.$digest();
          });

          $rootScope.$on('verified', function (user) {
            $scope.userLoggedIn = !!user;
            $scope.userInfo = user;
            $scope.$digest();
          });

          $rootScope.$on('logout', function (user) {
            $scope.userLoggedIn = false;
            $scope.userInfo = undefined;
          });
        }
      };
    }
  ])
  .directive('selectize', function () {
    return {
      restrict: 'A',
      link: function ($scope, $element) {
        var options = [];

        for (var i = 0; i <= 0; i++) {
          // TODO: This can be done only after localization for profile is completed [1] Uncomment line below [2] Don't hard code id and title
          // var title = config.langmap[config.supported_languages[i]] ? config.langmap[config.supported_languages[i]].nativeName : 'unknown';
          options.push({
            id: 'en-US',
            title: 'English (United States)'
          });
        }

        $element.selectize({
          options: options,
          labelField: 'title',
          valueField: 'id'
        });
        var selectize = $element[0].selectize;
        selectize.setValue('en-US');
      }
    };
  })
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
          var urlView = window.location.pathname.match(/\/([^\/]+)\/?$/)[1];
          var viewMatched = false;

          for (var i = 0, ii = elChildren.length; i < ii; i += 1) {
            var linkedView = elChildren.eq(i).attr('href').match(/\/([^\/]+)\/?$/)[1];

            if (linkedView === urlView) {
              elChildren.eq(i).addClass('active');
              viewMatched = true;
              break;
            }
          }

          if (!viewMatched) {
            elChildren.eq(0).addClass('active');
          }
        }
      };
    }
  ])
  .directive('wmpMakesList', ['makeapi', '$rootScope',
    function (makeapi) {
      return {
        restrict: 'E',
        scope: {
          lang: $rootScope.lang,
          username: '=wmpMakesListFor',
          kind: '@wmpMakesListKind',
          isLoading: '=wmpMakesListIsLoading',
          didServiceFail: '=wmpMakesListDidFail'
        },
        templateUrl: '/user/_partials/makes-list.html',
        link: function ($scope, el, attrs) {
          var highestPageLoaded = 0;
          var totalPages;

          $scope.didServiceFail = false;
          $scope.makes = [];
          $scope.isLoading = false;

          $scope.loadMore = function () {
            if (!$scope.isLoading && highestPageLoaded < totalPages) {
              getMakes(highestPageLoaded + 1);
            }
          };

          function getMakes(page) {
            $scope.isLoading = true;

            // Setup custom query parameters
            if ($scope.kind === 'makes') {
              makeapi.getRemixCounts();
              makeapi.user($scope.username);
            } else if ($scope.kind === 'likes') {
              makeapi.likedByUser($scope.username);
            } else if ($scope.kind === 'teach') {
              makeapi.getRemixCounts();
              makeapi.user($scope.username);
              makeapi.find({
                tags: ['teach']
              });
            }

            // Execute query
            makeapi
              .page(page)
              .then(function success(err, makes, total) {
                totalPages = Math.ceil(total / 10);

                if (err) {
                  console.error(err);
                  $scope.didServiceFail = true;
                }

                makes = makeapi.massage(makes);

                $scope.makes = $scope.makes.concat(makes);
                $scope.isLoading = false;
                $scope.$apply();

                highestPageLoaded = page;
              }, function fail(error) {
                $scope.didServiceFail = true;
                $scope.isLoading = false;
              });
          }

          getMakes(1);
        }
      };
    }
  ])
  .directive('wmpLinkCollector', ['jQuery',
    function ($) {
      return {
        restrict: 'AE',
        scope: {
          isEditMode: '=wmpEditMode',
          links: '=ngModel'
        },
        templateUrl: '/user/_partials/link-collector.html',
        link: function ($scope, el, attrs, controller) {
          var elWrapper = $(el),
            elInput = elWrapper.find('.link-form input');

          $scope.links = $scope.links || [];

          // An array of objects with service names for custom rendering
          $scope.annotatedlinks = [];

          $scope.showInvalid = false;
          $scope.showDuplicate = false;

          function getServiceFromURL(targetURL) {
            var title = targetURL.split('//')[1];

            // IMPORTANT:
            // If you add or modify a service be sure to update `stop-adblock.less`
            var serviceRegexes = {
              'fa-stop-adblock-twitter': /^(?:www.)?twitter\.com\//,
              'fa-stop-adblock-tumblr': /^[a-zA-Z]*\.tumblr\.com/,
              'fa-stop-adblock-facebook-square': /^(?:www.)?facebook\.com\/[^\/\n]*$/m,
              'fa-stop-adblock-google-plus': /^plus\.google\.com\//,
              'fa-stop-adblock-vimeo-square': /vimeo\.com\/[a-zA-Z]/,
              'fa-stop-adblock-github-alt': /^github\.com\/[^\/\n]*$/m,
              'fa-stop-adblock-dribbble': /^dribbble\.com\/[^\/\n]*$/m,
              'fa-stop-adblock-pinterest': /^(?:www.)?pinterest\.com\/[^\/]*(?:\/)?$/m,
              'fa-stop-adblock-linkedin': /((https?:\/\/)?[^.]+(\.)?linkedin\.com(\/[^\r\n\s]+)?)/m
            };

            // Attempt to match URL to a service
            for (var service in serviceRegexes) {
              if (title.match(serviceRegexes[service])) {
                return service;
              }
            }

            // If the URL doesn't match common social services, just use it verbatim
            return null;
          }

          function validateURL(url) {
            // Don't allow empty or null strings
            if (!url || url.trim() === '') {
              return false;
            }

            // If no protocol is set, assume http and prepend it
            if (!url.match(/https?:\/\//)) {
              url = 'http://' + url;
            }

            // Don't allow duplicate URLs
            if ($scope.links.length) {
              for (var i = $scope.links.length - 1; i >= 0; i--) {
                if (url === $scope.links[i]) {
                  $scope.showDuplicate = true;
                  return false;
                }
              }

              $scope.showDuplicate = false;
            }

            return url;
          }

          $scope.addLink = function (url) {
            url = validateURL(url);

            if (url) {
              $scope.links.push(url);
              return true;
            } else {
              return false;
            }
          };

          // Clear the input when a link is added
          $scope.addLinkUI = function (url) {
            if ($scope.addLink(url)) {
              elInput.val(null);
            }
          };

          $scope.removeLinkUI = function (index) {
            $scope.links.splice(index, 1);
          };

          function updateUI(links) {
            $scope.annotatedlinks = [];

            for (var index = 0, length = links.length; index < length; index++) {
              $scope.annotatedlinks.push({
                url: links[index],
                service: getServiceFromURL(links[index])
              });
            }
          }

          // EVENT DELEGATION -------------------------------------------------

          // Add links when enter is pressed
          elInput.on('keypress', function (event) {
            if (event.keyCode === 13) {
              event.preventDefault();
              $scope.addLinkUI($scope.userLink);
              $scope.$apply();
            }
          });

          // All UI link list changes are driven by changes to the links model
          $scope.$watch('links', function (newValue) {
            if (newValue) {
              updateUI(newValue);
            }
          }, true);
        }
      };
    }
  ]);
