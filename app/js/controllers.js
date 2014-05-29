angular.module('wmProfile.controllers', [])
  .controller('userMeta', ['$scope', '$rootScope', 'badgesService', 'userService', 'loginService',
    function ($scope, $rootScope, badgesService, userService, loginService) {
      // Scope defaults
      $scope.hasFeaturedBadge = false;
      $scope.isEditMode = false;
      $scope.canEdit = false;

      // Extrapolate user information from username
      userService.getUserData($rootScope.WMP.username).then(function (userData) {
        $scope.user = userData.user;
      });

      $scope.$watch('isEditMode', function (newValue, oldValue) {
        // Save when we exit edit mode
        if (newValue === false && oldValue === true) {
          userService.setUserData($rootScope.WMP.username, $scope.user);
        }
      });

      // Show the featured badge if user has it
      badgesService.getBadges($rootScope.WMP.username).then(function (badges) {
        var featuredBadge = 23; // Super mentor

        for (var i = 0, ii = badges.length; i < ii && !$scope.hasFeaturedBadge; i++) {
          if (badges[i].badge.id === featuredBadge) {
            $scope.hasFeaturedBadge = true;
          }
        }
      });

      // Show and hide edit button based on logged in user matching profile owner

      $scope.$on('userLoggedIn', function (event, data) {
        if ($rootScope.WMP.username === data.username) {
          $scope.canEdit = true;
          $scope.$digest();
        }
      });

      $scope.$on('userLoggedOut', function (event, data) {
        $scope.canEdit = false;
        $scope.$digest();
      });
    }
  ])
  .controller('badges', ['$scope', '$rootScope', 'badgesService',
    function ($scope, $rootScope, badgesService) {
      $scope.viewID = 'badges';

      badgesService.getBadges($rootScope.WMP.username).then(function (badges) {
        $scope.badges = badges;
      });
    }
  ])
  .controller('teachingResources', ['$scope', '$rootScope', 'makeapi',
    function ($scope, $rootScope, makeapi) {
      $scope.viewID = 'teachingResources';

      makeapi
        .getRemixCounts()
        .user($rootScope.WMP.username)
        .find({
          tags: ['teach']
        })
        .then(function (err, makes) {
          if (err) {
            console.error(err);
          }

          makes = makeapi.massage(makes);

          $scope.makes = makes;
          $scope.$apply();
        });
    }
  ])
  .controller('makes', ['$scope', '$rootScope', 'makeapi',
    function ($scope, $rootScope, makeapi) {
      $scope.viewID = 'makes';

      makeapi
        .getRemixCounts()
        .user($rootScope.WMP.username)
        .then(function (err, makes) {
          if (err) {
            console.error(err);
          }

          makes = makeapi.massage(makes);

          $scope.makes = makes;
          $scope.$apply();
        });
    }
  ])
  .controller('likes', ['$scope', '$rootScope', 'makeapi',
    function ($scope, $rootScope, makeapi) {
      $scope.viewID = 'likes';

      makeapi
        .likedByUser($rootScope.WMP.username)
        .then(function (err, makes) {
          if (err) {
            console.error(err);
          }

          makes = makeapi.massage(makes);

          $scope.makes = makes;
          $scope.$apply();
        });
    }
  ])
  .controller('events', ['$scope', '$rootScope', 'eventService',
    function ($scope, $rootScope, eventService) {
      $scope.viewID = 'events';

      eventService.query({
        organizerId: $rootScope.WMP.username
      }, function (data) {
        $scope.events = data;
      });
    }
  ]);
