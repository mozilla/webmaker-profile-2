angular.module('wmProfile', [
  'ngRoute',
  'ngResource',
  'ui.bootstrap',
  'wmProfile.filters',
  'wmProfile.services',
  'wmProfile.directives',
  'wmProfile.controllers',
  'locompleter'
]).
config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.when('/:username/badges', {
      templateUrl: '_partials/badges.html',
      controller: 'badges'
    });

    $routeProvider.when('/:username/teaching-resources', {
      templateUrl: '_partials/teaching-resources.html',
      controller: 'teachingResources'
    });

    $routeProvider.when('/:username/makes', {
      templateUrl: '_partials/makes.html',
      controller: 'makes'
    });

    $routeProvider.when('/:username/likes', {
      templateUrl: '_partials/likes.html',
      controller: 'likes'
    });

    $routeProvider.when('/:username/events', {
      templateUrl: '_partials/events.html',
      controller: 'events'
    });

    $routeProvider.when('/:username', {
      templateUrl: '_partials/badges.html',
      controller: 'badges'
    });

    // TODO - "404" for malformed routes / missing users

  }
]).
run(['$rootScope', 'jQuery',
  function ($rootScope, $) {
    var extractedUsername = window.location.pathname.match(/(?:\/user\/)([^/]+)/);

    extractedUsername = extractedUsername ? extractedUsername[1] : undefined;

    $rootScope.WMP = {
      username: extractedUsername
    };

    $.ajax({
      async: false,
      url: '_service/env.json',
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
