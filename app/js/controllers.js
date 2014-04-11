angular.module('wmProfile.controllers', [])
  .controller('teachingResources', ['$scope',
    function ($scope) {
      $scope.viewID = 'teachingResources';
    }
  ])
  .controller('makes', ['$scope',
    function ($scope) {
      $scope.viewID = 'makes';
    }
  ])
  .controller('likes', ['$scope',
    function ($scope) {
      $scope.viewID = 'likes';
    }
  ])
  .controller('events', ['$scope', '$rootScope', 'eventService',
    function ($scope, $rootScope, eventService) {
      $scope.viewID = 'events';

      eventService.query({
        organizerId: $rootScope.WMP.username
      }, function (data) {
        console.log(data);
        $scope.events = data;
      });
    }
  ]);
