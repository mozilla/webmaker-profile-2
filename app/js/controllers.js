angular.module('wmProfile.controllers', [])
  .controller('teachingResources', ['$scope',
    function ($scope) {
      $scope.viewID = 'teachingResources';
    }
  ])
  .controller('makes', ['$scope', '$rootScope', 'makeapi',
    function ($scope, $rootScope, makeapi) {
      $scope.viewID = 'makes';

      makeapi
        .user($rootScope.WMP.username)
        .then(function (err, makes) {
          if (err) {
            console.error(err);
          }

          console.log(makes);

          $scope.makes = makes;
          $scope.$apply();
        });
    }
  ])
  .controller('likes', ['$scope',
    function ($scope) {
      $scope.viewID = 'likes';
    }
  ])
  .controller('userMeta', ['$scope',
    function ($scope) {}
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
