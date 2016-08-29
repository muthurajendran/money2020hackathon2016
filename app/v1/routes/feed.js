'use strict';

var geocoder = require('app/v1/middlewares/geocoder');
var Photo = require('../models/photo');

var object = {
  userFeed: function(req, res, next) {
    try {
      Photo.find({
        location: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], 3 / 3963.2 ] } }
      }).populate(['reactions.sad','reactions.surprise','reactions.angry','reactions.lol','reactions.heart','reactions.thumbsUp'])
      .then(function(photos) {
        res.json({
          success: true,
          data: photos
        });
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err});
      });
    } catch (err) {
      return next({error: 'ERROR', message: err});
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
      return next({error: 'ERROR', message: err});
    }
  }
};

module.exports = object;