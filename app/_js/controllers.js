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
  .controller('badges', ['$scope', '$rootScope', '$sce', 'badgesService',
    function ($scope, $rootScope, $sce, badgesService) {
      $scope.viewID = 'badges';
      $scope.backpackURL = $sce.trustAsResourceUrl($rootScope.WMP.config.backpackURL);
      $scope.didServiceFail = false;
      $scope.dataLoading = true;

      badgesService.getBadges($rootScope.WMP.username).then(function success(badges) {
        $scope.badges = badges;
        $scope.dataLoading = false;
      }, function fail(error) {
        $scope.didServiceFail = true;
        $scope.dataLoading = false;
      });
    }
  ])
  .controller('teachingResources', ['$scope', '$rootScope',
    function ($scope, $rootScope) {}
  ])
  .controller('makes', ['$scope', '$rootScope',
    function ($scope, $rootScope) {}
  ])
  .controller('likes', ['$scope', '$rootScope',
    function ($scope, $rootScope) {}
  ])
  .controller('events', ['$scope', '$rootScope', 'eventService',
    function ($scope, $rootScope, eventService) {
      $scope.viewID = 'events';
      $scope.didServiceFail = false;
      $scope.dataLoading = true;

      eventService.query({
        username: $rootScope.WMP.username
      }, function success(data) {
        $scope.events = data.sort(function (a, b) {
          return (new Date(b.beginDate).getTime() - new Date(a.beginDate).getTime());
        });

        $scope.dataLoading = false;
      }, function fail(error) {
        $scope.didServiceFail = true;
        $scope.dataLoading = false;
      });

      $scope.isDiffYear = function (idx) {
        var curYear = new Date($scope.events[idx].beginDate).getFullYear();

        if (idx === 0) {
          return true;
        }

        var prevYear = new Date($scope.events[idx - 1].beginDate).getFullYear();
        return curYear !== prevYear;
      };
    }
  ]);
