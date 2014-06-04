module.exports = function (config) {
  var express = require('express');
  var bodyParser = require('body-parser');
  var morgan = require('morgan');
  var messina = require('messina')('webmaker-profile-2-' + config.nodeEnv);
  var WebmakerAuth = require('webmaker-auth');
  var path = require('path');
  var argv = require('optimist').argv;

  var webmakerAuth = new WebmakerAuth({
    // required
    loginURL: config.loginUrlWithAuth,
    secretKey: config.sessionSecret,

    // optional
    domain: config.cookieDomain, // default undefined
    forceSSL: config.forceSSL // default false
  });

  // Determine paths for temporary files used by Live Reload task (if used)
  var lrRelativePath = argv.path;
  var lrAbsolutePath = lrRelativePath ? path.resolve(__dirname, lrRelativePath) : undefined;

  var app = express();
  var routes = require('./routes')(config, webmakerAuth, lrRelativePath);
  var middleware = require('./middleware')(config);

  if (config.enableGELFLogs) {
    app.use(messina.middleware());
  } else {
    app.use(morgan('dev'));
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(webmakerAuth.cookieParser());
  app.use(webmakerAuth.cookieSession());
  app.use(routes);
  app.use(middleware.errorHandler);
  app.use('/user', express.static(lrAbsolutePath || __dirname + '/../app'));

  return app;
};
