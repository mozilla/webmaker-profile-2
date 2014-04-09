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
  .controller('events', ['$scope',
    function ($scope) {
      $scope.viewID = 'events';
    }
  ]);
