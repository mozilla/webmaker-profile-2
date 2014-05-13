angular.module('wmProfile', [
  'ngRoute',
  'ngResource',
  'wmProfile.filters',
  'wmProfile.services',
  'wmProfile.directives',
  'wmProfile.controllers',
  'locompleter'
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
run(['$rootScope', 'jQuery',
  function ($rootScope, $) {
    $rootScope.WMP = {
      username: window.location.hash.match(/#!\/([^\/]+)/)[1]
    };

    $.ajax({
      async: false,
      url: 'env.json',
      dataType: 'json'
    })
      .done(function (config) {
        $rootScope.WMP.config = config;
      })
      .fail(function () {
        console.error('Config failed to load. Did you run grunt?');
      });
  }
]);
