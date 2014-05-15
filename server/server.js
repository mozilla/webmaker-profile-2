module.exports = function (config) {
  var express = require('express');
  var bodyParser = require('body-parser');
  var morgan = require('morgan');

  var app = express();
  var routes = require('./routes')(config);
  var middleware = require('./middleware')(config);

  var reloadFiles = process.argv[2] !== undefined && process.argv[2].split('=').length > 1 && process.argv[2].split('=')[0] === 'path' ? __dirname + process.argv[2].split('=')[1] : undefined;

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(routes);
  app.use(middleware.errorHandler);
  app.use('/user', express.static(reloadFiles || __dirname + '/../app'));

  return app;
};
