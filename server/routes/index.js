var express = require('express');
var async = require('async');
var fs = require('fs');
var UserClient = require('webmaker-user-client');
var BadgeClient = require('badgekit-api-client');
var path = require('path');
var i18n = require('webmaker-i18n');
var wts = require('webmaker-translation-stats');

module.exports = function (config, webmakerAuth, liveReloadRelativePath) {
  var router = express.Router();
  var userClient = new UserClient({
    endpoint: config.loginUrlWithAuth
  });
  var badgesClient = new BadgeClient(config.badgekitApiUrl, {
    key: config.badgekitApiKey,
    secret: config.badgekitApiSecret
  });
  var badgesContext = {
    system: 'webmaker'
  };

  //Healthcheck
  router.get('/user/_healthcheck', function(req, res) {
    var info = {
      http: 'okay',
      version: require('../../package').version,
    };
    wts(i18n.getSupportLanguages(), path.join(__dirname, "../../locale"), function (err, data) {
      if (err) {
        info.locales = err.toString();
      } else {
        info.locales = data;
      }
      res.send(info);
    });
  });

  // Localized Strings
  router.get("/user/localized/strings/:lang?", i18n.stringsRoute("en-US"));

  // Match any URL that doesn't fall under an underscore prefixed subdirectory and serve index.html
  // eg: /user/joe/*  NOT  /user/_less/app.less
  router.get(/^\/user(?!\/_)/, function (req, res) {
    if (liveReloadRelativePath) {
      res.sendfile(path.resolve(__dirname, '../', liveReloadRelativePath, 'index.html'));
    } else {
      res.sendfile(path.resolve(__dirname, '../../app/index.html'));
    }
  })

  var loginPaths = {
    authenticate: '/user/_service/login/authenticate',
    verify: '/user/_service/login/verify',
    logout: '/user/_service/login/logout',
    request: '/user/_service/login/auth/v2/request',
    uidExists: '/user/_service/login/auth/v2/uid-exists',
    createUser: '/user/_service/login/auth/v2/create',
    authenticateToken: '/user/_service/login/auth/v2/authenticate-token',
    verifyPassword: '/user/_service/login/auth/v2/verify-password',
    requestResetCode: '/user/_service/login/auth/v2/request-reset-code',
    resetPassword: '/user/_service/login/auth/v2/reset-password'
  };

  router.get('/user/_service/env.json', function (req, res) {
    var env = config.public;
    env.csrf = req.csrfToken();
    env.l10n = {
      supported_languages: i18n.getSupportLanguages(),
      lang: req.localeInfo.lang,
      defaultLang: 'en-US',
      direction: req.localeInfo.direction
    };
    env.loginPaths = loginPaths;
    res.json(config.public);
  });

  // Returns a list of a user's badges given a username
  router.get('/user/_service/badges/username/:username', function (req, res, next) {
    async.waterfall([
      function (callback) {
        userClient.get.byUsername(req.params.username, callback);
      },
      function (result, callback) {
        if (!result.user) {
          var error = new Error('User not found');
          error.code = 400;
          return callback(error);
        }
        badgesClient.getBadgeInstances(badgesContext, result.user.email, callback);
      }
    ], function (err, badges) {
      if (err) {
        return next(err);
      }
      // Remove emails
      badges.forEach(function (badge) {
        badge.email = undefined;
      });
      res.send(badges);
    });

  });

  // Get a user's public data subset
  router.get('/user/_service/user-data/:username', function (req, res, next) {
    userClient.get.byUsername(req.params.username, function (err, data) {
      if (err) {
        return res.json(500, {
          error: err.toString()
        });
      }

      if (!data.user) {
        return res.send(404);
      }

      // Make the returned avatar be 400x400
      data.user.avatar = data.user.avatar + '&s=400';

      // Don't expose PII publicly
      delete data.user.email;

      res.json(data);
    })
  });

  router.put('/user/_service/user-data/:username', function (req, res, next) {
    if (req.params.username !== req.session.user.username) {
      return res.json(403, {
        "error": "You do not have permission to modify " + req.params.username
      })
    }

    var filteredData = {
      bio: req.body.bio,
      location: req.body.location,
      links: req.body.links,
      bgColor: req.body.bgColor
    }

    userClient.update.byUsername(req.params.username, filteredData, function (err, data) {
      if (err) {
        return res.json(500, {
          error: err
        });
      }

      res.json(data);
    });
  });

  router.post('/user/_service/login/verify', webmakerAuth.handlers.verify);
  router.post('/user/_service/login/authenticate', webmakerAuth.handlers.authenticate);
  router.post('/user/_service/login/create', webmakerAuth.handlers.create);
  router.post('/user/_service/login/logout', webmakerAuth.handlers.logout);
  router.post('/user/_service/login/check-username', webmakerAuth.handlers.exists);

  router.post('/user/_service/login/auth/v2/uid-exists', webmakerAuth.handlers.uidExists);
  router.post('/user/_service/login/auth/v2/request', webmakerAuth.handlers.request);
  router.post('/user/_service/login/auth/v2/authenticate-token', webmakerAuth.handlers.authenticateToken);
  router.post('/user/_service/login/auth/v2/create', webmakerAuth.handlers.createUser);
  router.post('/user/_service/login/auth/v2/verify-password', webmakerAuth.handlers.verifyPassword);
  router.post('/user/_service/login/auth/v2/request-reset-code', webmakerAuth.handlers.requestResetCode);
  router.post('/user/_service/login/auth/v2/reset-password', webmakerAuth.handlers.resetPassword);

  return router;
};
