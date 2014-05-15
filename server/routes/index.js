var express = require('express');
var async = require('async');
var fs = require('fs');
var UserClient = require('webmaker-user-client');
var BadgeClient = require('badgekit-api-client');

module.exports = function (config) {
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

  return router;
};
