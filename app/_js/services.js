// NOTE / TODO :
// Constants are used for dependency injecton of 3rd party JS libs.
// Although these *currently* exist as global objects,
//  they should eventually be pulled in by a module loader and removed from the global namespace.

angular.module('wmProfile.services', [])
  .constant('MakeAPI', window.Make)
  .constant('jQuery', window.$)
  .constant('WebmakerAuthClient', window.WebmakerAuthClient)
  .factory('userService', ['$resource', '$q', '$rootScope',
    function ($resource, $q, $rootScope) {
      var userAPI = $resource('/user/_service/user-data/:username', {
        username: '@username'
      }, {
        put: {
          method: 'PUT'
        }
      });

      var userData;

      return {
        getUserData: function (username) {
          var deferred = $q.defer();

          if (userData) {
            deferred.resolve(userData);
          } else {
            userAPI.get({
              username: username
            }, function (data) {
              $rootScope.userExists = true;
              userData = data;
              deferred.resolve(userData);
            }, function (err) {
              console.error('User ' + username + ' doesn\'t exist.');
              $rootScope.userExists = false;
              deferred.reject(err);
            });
          }

          return deferred.promise;
        },
        setUserData: function (username, data) {
          var deferred = $q.defer();

          userAPI.put({
            username: username
          }, {
            bio: data.bio,
            location: data.location,
            links: data.links
          }, function (returnedData) {
            userData = data;
            deferred.resolve(userData);
          }, function (err) {
            console.error('Failed to update user ' + username, err);
            deferred.reject(err);
          });
        }
      };
    }
  ])
  .factory('loginService', ['$rootScope', 'WebmakerAuthClient',
    function ($rootScope, WebmakerAuthClient) {
      var visitorData;
      var auth = new WebmakerAuthClient({
        csrfToken: $rootScope.WMP.config.csrf,
        handleNewUserUI: false,
        paths: {
          authenticate: '/user/_service/login/authenticate',
          checkUsername: '/user/_service/login/check-username',
          create: '/user/_service/login/create',
          logout: '/user/_service/login/logout',
          verify: '/user/_service/login/verify',
        }
      });

      auth.on('login', function (user, debuggingInfo) {
        visitorData = user;
        $rootScope.$broadcast('userLoggedIn', visitorData);
        $rootScope.userLoggedIn = true;
      });

      auth.on('logout', function () {
        visitorData = undefined;
        $rootScope.$broadcast('userLoggedOut');
        $rootScope.userLoggedIn = false;
      });

      auth.on('error', function (errorMessage) {
        console.error(errorMessage);
      });

      return {
        auth: auth,
        getData: function () {
          return visitorData;
        }
      };
    }
  ])
  .factory('badgesService', ['$resource', '$q',
    function ($resource, $q) {
      var badgeAPI = $resource('/user/_service/badges/username/:username', {
        username: '@username'
      });

      var badges;

      return {
        // Only do badges service call once and cache it
        getBadges: function (username) {
          var deferred = $q.defer();

          if (badges) {
            deferred.resolve(badges);
          } else {
            badgeAPI.query({
              username: username
            }, function (data) {
              badges = data;
              deferred.resolve(badges);
            }, function (err) {
              deferred.reject(err);
            });
          }

          return deferred.promise;
        }
      };

    }
  ])
  .factory('eventService', ['$rootScope', '$resource',
    function ($rootScope, $resource) {
      return $resource($rootScope.WMP.config.eventService + '/events/:id', {
        username: '@username',
        after: '@after'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  ])
  .factory('makeapi', ['$rootScope', '$resource', 'MakeAPI',
    function ($rootScope, $resource, MakeAPI) {
      var makeapi = new MakeAPI({
        apiURL: $rootScope.WMP.config.makeAPI
      });

      // Massage make data for easier consumption in view
      makeapi.massage = function (makes) {
        makes.forEach(function (make, index) {
          makes[index].likeCount = make.likes.length;
        });

        return makes;
      };

      return makeapi;
    }
  ]);
