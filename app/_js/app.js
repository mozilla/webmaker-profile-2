angular.module('wmProfile', [
  'ngRoute',
  'ngResource',
  'ui.bootstrap',
  'wmProfile.filters',
  'wmProfile.services',
  'localization',
  'wmProfile.directives',
  'wmProfile.controllers',
  'locompleter',
  'infinite-scroll'
]).
config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider.when('/:locale?/user/:username/badges', {
      templateUrl: '/user/_partials/badges.html',
      controller: 'badges'
    })
      .when('/:locale?/user/:username/badges', {
        templateUrl: '/user/_partials/badges.html',
        controller: 'badges'
      })
      .when('/:locale?/user/:username/teaching-resources', {
        templateUrl: '/user/_partials/teaching-resources.html',
        controller: 'teachingResources'
      })
      .when('/:locale?/user/:username/makes', {
        templateUrl: '/user/_partials/makes.html',
        controller: 'makes'
      })
      .when('/:locale?/user/:username/likes', {
        templateUrl: '/user/_partials/likes.html',
        controller: 'likes'
      })
      .when('/:locale?/user/:username/events', {
        templateUrl: '/user/_partials/events.html',
        controller: 'events'
      })
      .when('/:locale?/user/:username', {
        templateUrl: '/user/_partials/badges.html',
        controller: 'badges'
      });

    // TODO - "404" for malformed routes / missing users
    $locationProvider.html5Mode(true);

  }
]).
run(['$rootScope', '$http', 'jQuery',
  function ($rootScope, $http, $) {
    var extractedUsername = window.location.pathname.match(/(?:\/user\/)([^/]+)/);

    extractedUsername = extractedUsername ? extractedUsername[1] : undefined;

    $rootScope.WMP = {
      username: extractedUsername
    };

    $.ajax({
      async: false,
      url: '/user/_service/env.json',
      dataType: 'json'
    })
      .done(function (config) {
        $rootScope.WMP.config = config;
        // Set locale information
        if (config.l10n.supported_languages.indexOf(config.l10n.lang) > 0) {
          $rootScope.lang = config.l10n.lang;
        } else {
          $rootScope.lang = config.l10n.defaultLang;
        }
        $rootScope.direction = config.l10n.direction;
        $rootScope.arrowDir = config.l10n.direction === 'rtl' ? 'left' : 'right';

        // Configure CSRF token
        $http.defaults.headers.common['X-CSRF-Token'] = config.csrf;
      })
      .fail(function () {
        console.error('Config failed to load. Did you run grunt?');
      });
  }
]);
