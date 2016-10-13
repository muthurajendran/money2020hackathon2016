'use strict';

var geocoder = require('app/v1/middlewares/geocoder');
var Photo = require('../models/photo');
// var User = require('../models/user');

var object = {
  userFeed: function(req, res, next) {
    try {
      var radius = req.body.radius || 3;
      var userObj = req.user;

      Photo.find({
        location: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], parseFloat(radius) / 3963.2 ] } }
      })
      .sort({updatedAt: -1})
      .populate(['reactions.sad','reactions.surprise','reactions.angry','reactions.lol','reactions.heart','reactions.thumbsUp','userId'])
      .then(function(photos) {
        res.json({
          success: true,
          count: photos.length,
          feed: photos,
          user: userObj
        });
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err});
      });
    } catch (err) {
      return next({error: 'ERROR', message: err.stack});
    }
  },

  getLocationName: function(req, res, next) {
    try {
      geocoder.getLocationName(req.body.latitude,req.body.longitude).then(function(data) {
        res.json({
          success: true,
          locationName: data
        });
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err});
      });
    } catch (err) {
      return next({error: 'ERROR', message: err.stack});
    }
  }
};

module.exports = object;