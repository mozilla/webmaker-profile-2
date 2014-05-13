module.exports = function (config) {
  var middleware = {};

  // Generic error handler.
  middleware.errorHandler = function (err, req, res, next) {
    var message;
    var code;

    if (err) {
      console.error(err.stack);
      message = err.message || 'There was an internal server error.';
      code = err.code || 500
    }

    res.send(code, message);
  };

  return middleware;

};
