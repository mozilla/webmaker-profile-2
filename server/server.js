module.exports = function (config) {
  var express = require('express');
  var bodyParser = require('body-parser');
  var morgan = require('morgan');

  var app = express();
  var routes = require('./routes')(config);
  var middleware = require('./middleware')(config);

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(routes);
  app.use(middleware.errorHandler);
  app.use(express.static(__dirname + '/../app'));

  return app;
};
