module.exports = function (config) {
  var express = require('express');
  var bodyParser = require('body-parser');
  var morgan = require('morgan');
  var messina = require('messina')('webmaker-profile-2-' + config.nodeEnv);

  var app = express();
  var routes = require('./routes')(config);
  var middleware = require('./middleware')(config);

  var reloadFiles = process.argv[2] !== undefined && process.argv[2].split('=').length > 1 && process.argv[2].split('=')[0] === 'path' ? __dirname + process.argv[2].split('=')[1] : undefined;

  if (config.enableGELFLogs) {
    app.use(messina.middleware());
  } else {
    app.use(morgan('dev'));
  }
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(routes);
  app.use(middleware.errorHandler);
  app.use('/user', express.static(reloadFiles || __dirname + '/../app'));

  return app;
};
