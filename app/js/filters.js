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
  ])
  .filter('rfc3339', function () {
    return function (timestamp) {
      timestamp = timestamp || '';
      return new Date(timestamp).toISOString();
    };
  })
  .filter('decode', function () {
    return function (tag) {
      tag = tag || '';
      return decodeURI(tag);
    };
  });
