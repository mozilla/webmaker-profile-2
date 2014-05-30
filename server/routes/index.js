var express = require('express');
var async = require('async');
var fs = require('fs');
var UserClient = require('webmaker-user-client');
var BadgeClient = require('badgekit-api-client');

module.exports = function (config, webmakerAuth) {
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

  router.get('/user/env.json', function (req, res) {
    res.json(config.public);
  });

  // Returns a list of a user's badges given a username
  router.get('/user/badges/username/:username', function (req, res, next) {
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
  router.get('/user/user-data/:username', function (req, res, next) {
    userClient.get.byUsername(req.params.username, function (err, data) {
      if (err) {
        return res.json(500, {
          error: err.toString()
        });
      }

      // Make the returned avatar be 400x400
      data.user.avatar = data.user.avatar + '&s=400';

      // Don't expose PII publicly
      delete data.user.email;

      res.json(data);
    })
  });

  router.put('/user/user-data/:username', function (req, res, next) {
    if (req.params.username !== req.session.user.username) {
      return res.json(403, {
        "error": "You do not have permission to modify " + req.params.username
      })
    }

    var filteredData = {
      bio: req.body.bio,
      location: req.body.location,
      links: req.body.links
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

  router.post('/user/verify', webmakerAuth.handlers.verify);
  router.post('/user/authenticate', webmakerAuth.handlers.authenticate);
  router.post('/user/create', webmakerAuth.handlers.create);
  router.post('/user/logout', webmakerAuth.handlers.logout);
  router.post('/user/check-username', webmakerAuth.handlers.exists);

  return router;
};
