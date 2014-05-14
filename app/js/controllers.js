angular.module('wmProfile.controllers', [])
  .controller('userMeta', ['$scope',
    function ($scope) {}
  ])
  .controller('badges', ['$scope', '$rootScope', 'badgesService',
    function ($scope, $rootScope, badgesService) {
      $scope.viewID = 'badges';

      badgesService.query({
        username: $rootScope.WMP.username
      }, function (badges) {
        $scope.badges = badges;
      }, function (err) {
        console.log(err);
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
