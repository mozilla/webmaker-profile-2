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
      if (!data.error) {
        res.json({
          avatar: 'https://secure.gravatar.com/avatar/' + data.user.emailHash + '?s=400&d=https%3A%2F%2Fstuff.webmaker.org%2Favatars%2Fwebmaker-avatar-200x200.png'
        });
      } else {
        res.send(404);
      }
    })
  });

  router.post('/user/verify', webmakerAuth.handlers.verify);
  router.post('/user/authenticate', webmakerAuth.handlers.authenticate);
  router.post('/user/create', webmakerAuth.handlers.create);
  router.post('/user/logout', webmakerAuth.handlers.logout);
  router.post('/user/check-username', webmakerAuth.handlers.exists);

  return router;
};
