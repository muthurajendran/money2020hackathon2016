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
        return photo.save();
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

  addReaction: function(req, res, next) {
    try {
      
      var conf = {
        0: 'angry',
        1: 'surprise',
        2: 'heart',
        3: 'lol',
        4: 'sad',
        5: 'thumbsUp'
      };

      Photo.findById(req.body.photoId)
      .then(function(photo) {
        photo.reactions.angry.remove(req.body.userId);
        photo.reactions.surprise.remove(req.body.userId);
        photo.reactions.heart.remove(req.body.userId);
        photo.reactions.lol.remove(req.body.userId);
        photo.reactions.sad.remove(req.body.userId);
        photo.reactions.thumbsUp.remove(req.body.userId);

        console.log(conf[req.body.type]);
        photo.reactions[conf[req.body.type]].push(req.body.userId);
        return photo.save();
      })
      .then(function(photo1) {
        res.json({
          success: true,
          message: 'Reaction Added',
          photo: photo1
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