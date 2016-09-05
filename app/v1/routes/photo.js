'use strict';

var Photo = require('../models/photo');
var geocoder = require('app/v1/middlewares/geocoder');
// var config = require('server/config/environment');

var object = {

  // uploadPhotoCloud: function(req, res, next) {
  //   var data = req.body;
  //   // Was an image uploaded? If so, we'll use its public URL
  //   // in cloud storage.
  //   if (req.file && req.file.cloudStoragePublicUrl) {
  //     data.imageUrl = req.file.cloudStoragePublicUrl;
  //   }

  //   res.json({
  //     success: true,
  //     data: data
  //   });
  // },
  // API function code goes here 
  uploadPhoto: function(req, res, next) {
    try {
      if (req.file && req.file.cloudStoragePublicUrl) {
        var newPhoto = new Photo({
          url: req.file.cloudStoragePublicUrl,
          location: { 
            type: 'Point',
            coordinates: [req.body.longitude,req.body.latitude],
          },
          userId: req.body.userId
        });

        geocoder.getLocationName(req.body.latitude,req.body.longitude)
        .then(function(locationName) {
          newPhoto.locationName = locationName;
          return newPhoto.save();
        })
        .then(function(savedPhoto) {
          return Photo.find({
            location: { $geoWithin: { $centerSphere: [ [ parseFloat(req.body.longitude), parseFloat(req.body.latitude) ], 3 / 3963.2 ] } }
          }).populate(['reactions.sad','reactions.surprise','reactions.angry','reactions.lol','reactions.heart','reactions.thumbsUp']); 
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