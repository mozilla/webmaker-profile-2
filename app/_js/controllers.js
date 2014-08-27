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
        username: $rootScope.WMP.username
      }, function (data) {
        $scope.events = data.sort(function (a, b) {
          return (new Date(b.beginDate).getTime() - new Date(a.beginDate).getTime());
        });
      });

      $scope.isDiffYear = function(idx) {
        var curYear = new Date($scope.events[idx].beginDate).getFullYear();

        if (idx === 0) {
          return true;
        }

        var prevYear = new Date($scope.events[idx-1].beginDate).getFullYear();
        return curYear !== prevYear;
      };
    }
  ])
  .controller('createUserController', ['$scope', '$http', '$modal', 'loginService',
    function ($scope, $http, $modal, loginService) {

      loginService.auth.on('newuser', function (assertion) {
        $modal.open({
          templateUrl: '/user/_partials/create-user-form.html',
          controller: createUserCtrl,
          resolve: {
            assertion: function () {
              return assertion;
            }
          }
        });
      });

      var createUserCtrl = function ($scope, $modalInstance, loginService, assertion) {

        $scope.form = {};
        $scope.user = {};

        // TODO: Finish localization and remove hard coded variables.
        $scope.supported_languages = 'en-US';
        $scope.currentLang = 'en-US';
        $scope.langmap = {
          'en-US': {
            'nativeName': 'English (United States)',
            'englishName': 'English (United States)'
          }
        };

        $scope.checkUsername = function () {
          if (!$scope.form.user.username) {
            return;
          }
          $http
            .post(loginService.auth.urls.checkUsername, {
              username: $scope.form.user.username.$viewValue
            })
            .success(function (username) {
              $scope.form.user.username.$setValidity('taken', !username.exists);
            })
            .error(function (err) {
              console.log(err);
              $scope.form.user.username.$setValidity('taken', true);
            });
        };

        $scope.createUser = function () {
          $scope.submit = true;
          if ($scope.form.user.$valid && $scope.form.agree) {
            loginService.auth.createUser({
              assertion: assertion,
              user: $scope.user
            });
            $modalInstance.close();
          }
        };

        $scope.cancel = function () {
          loginService.auth.analytics.webmakerNewUserCancelled();
          $modalInstance.dismiss('cancel');
        };
      };

      loginService.auth.verify();
    }
  ]);
