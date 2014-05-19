angular.module('wmProfile.controllers', [])
  .controller('userMeta', ['$scope', '$rootScope', 'badgesService', 'userService',
    function ($scope, $rootScope, badgesService, userService) {
      // Scope defaults
      $scope.hasFeaturedBadge = false;
      $scope.isEditMode = false;

      // Pull in user's saved editable metadata
      var rehydratedData = JSON.parse(localStorage.getItem('userData') || '{}');

      // TODO – Hack. How can this work w/out setTimeout?
      //        Using setTimeout because otherwise there is a collision error
      setTimeout(function() {
        if (rehydratedData) {
          $scope.user.bio = rehydratedData.bio || null;
          $scope.user.location = rehydratedData.location || null;
          $scope.user.linkList = rehydratedData.linkList || [];
          $scope.$apply();
        }
      }, 1);

      // TODO – Periodically persist this data to the server
      $scope.$watch('user', function (newValue) {
        localStorage.setItem('userData', JSON.stringify(newValue));
      }, true);

      // Extrapolate user information from username
      // Currently this is needed to get an avatar IMG URL
      userService.getUserData($rootScope.WMP.username).then(function (userData) {
        $scope.userData = userData;
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
