// NOTE / TODO :
// Constants are used for dependency injecton of 3rd party JS libs.
// Although these *currently* exist as global objects,
//  they should eventually be pulled in by a module loader and removed from the global namespace.

angular.module('wmProfile.services', [])
  .constant('MakeAPI', window.Make)
  .constant('jQuery', window.$)
  .factory('eventService', ['$rootScope', '$resource',
    function ($rootScope, $resource) {
      return $resource($rootScope.WMP.config.eventService + '/events/:id', {
        organizerId: '@organizerId',
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
