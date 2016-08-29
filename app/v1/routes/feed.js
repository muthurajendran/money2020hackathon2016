'use strict';

var geocoder = require('app/v1/middlewares/geocoder');


var object = {
  userFeed: function(req, res, next) {
    // geocoder.reverse({lat: 34.049285, lon: -118.355264}).then(function(res) {
    //   console.log(res[0].extra.neighborhood);
    // })
    // .catch(function(err) {
    //   console.log(err);
    // });
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