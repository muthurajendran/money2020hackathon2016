'use strict';

var Photo = require('../models/photo');
var geocoder = require('app/v1/middlewares/geocoder');
// var config = require('server/config/environment');

var object = {

  uploadPhoto: function(req, res, next) {
    try {
      if (req.file && req.file.cloudStoragePublicUrl) {
        var newPhoto = new Photo({
          url: req.file.cloudStoragePublicUrl,
          location: { 
            type: 'Point',
            coordinates: [req.body.longitude,req.body.latitude],
          },
          photo_type: req.body.type || '',
          userId: req.user._id.toString()
        });

        geocoder.getLocationName(req.body.latitude,req.body.longitude)
        .then(function(locationName) {
          newPhoto.locationName = locationName;
          return newPhoto.save();
        })
        .then(function(data) {
          res.json({
            success: true,
            message: 'Photo_Created',
            feed: data
          });
        })
        .catch(function(err) {
          return next({error: 'ERROR', message: err});
        });
      } else {
        return next({error: 'PHOTO_NOT_CREATED', message: req.body});
      }
    } catch (err) {
      return next({error: 'ERROR', message: err.stack});
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
        photo.reactions.angry.remove(req.user._id);
        photo.reactions.surprise.remove(req.user._id);
        photo.reactions.heart.remove(req.user._id);
        photo.reactions.lol.remove(req.user._id);
        photo.reactions.sad.remove(req.user._id);
        photo.reactions.thumbsUp.remove(req.user._id);

        photo.reactions[conf[req.body.type]].push(req.user._id);
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
      return next({error: 'ERROR', message: err.stack});
    }
  }
};
module.exports = object;