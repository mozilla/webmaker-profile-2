angular.module('wmProfile.services', [])
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
  ]);
