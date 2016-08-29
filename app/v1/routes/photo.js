'use strict';

var Photo = require('../models/photo');
var geocoder = require('app/v1/middlewares/geocoder');
// var config = require('server/config/environment');

var object = {
  // API function code goes here 
  uploadPhoto: function(req, res, next) {
    try {
      var photo = new Photo({
        url: req.body.url,
        location: { 
          type: 'Point',
          coordinates: [req.body.longitude,req.body.latitude],
        },
        userId: req.body.userId
      });
      
      geocoder.getLocationName(req.body.latitude,req.body.longitude)
      .then(function(locationName) {
        photo.locationName = locationName;
        return photo.save()
      })
      .then(function(data) {
        res.json({
          success: true,
          message: 'Photo_Created',
          photo: data
        });
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err});
      });
    } catch (err) {
      return next({error: 'ERROR', message: err});
    }
  },
};
module.exports = object;