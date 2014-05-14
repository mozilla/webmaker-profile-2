angular.module('wmProfile.filters', [])
  .filter('interpolate', ['version',
    function (version) {
      return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    }
  ])
  .filter('noProtocol', [

    function () {
      return function (text) {
        return text.replace(/https?:\/\//, '');
      };
    }
  ]);
