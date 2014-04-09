angular.module('wmProfile', [
  'ngRoute',
  'wmProfile.filters',
  'wmProfile.services',
  'wmProfile.directives',
  'wmProfile.controllers'
]).
config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/teaching-resources', {
      templateUrl: 'partials/teaching-resources.html',
      controller: 'teachingResources'
    });

    $routeProvider.when('/makes', {
      templateUrl: 'partials/makes.html',
      controller: 'makes'
    });

    $routeProvider.when('/likes', {
      templateUrl: 'partials/likes.html',
      controller: 'likes'
    });

    $routeProvider.when('/events', {
      templateUrl: 'partials/events.html',
      controller: 'events'
    });

    $routeProvider.otherwise({
      redirectTo: '/'
    });
  }
]);
