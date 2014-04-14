angular.module('wmProfile', [
  'ngRoute',
  'ngResource',
  'wmProfile.filters',
  'wmProfile.services',
  'wmProfile.directives',
  'wmProfile.controllers'
]).
config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/:username/teaching-resources', {
      templateUrl: 'partials/teaching-resources.html',
      controller: 'teachingResources'
    });

    $routeProvider.when('/:username/makes', {
      templateUrl: 'partials/makes.html',
      controller: 'makes'
    });

    $routeProvider.when('/:username/likes', {
      templateUrl: 'partials/likes.html',
      controller: 'likes'
    });

    $routeProvider.when('/:username/events', {
      templateUrl: 'partials/events.html',
      controller: 'events'
    });

    // Route any '/USERNAME' url to '/USERNAME/teaching-resources'
    $routeProvider.otherwise({
      redirectTo: function (params, path) {
        return path + (path.match(/\/$/) ? '' : '/') + 'teaching-resources';
      }
    });
  }
]).
run(['$rootScope',
  function ($rootScope) {
    $rootScope.WMP = {
      // TODO : Externalize config as JSON. Pull via XHR.
      config: {
        eventApp: 'http://localhost:1981',
        eventService: 'http://localhost:1989',
        makeAPI: 'https://makeapi.webmaker.org'
      },
      username: window.location.hash.match(/#!\/([^\/]+)/)[1]
    };
  }
]);
