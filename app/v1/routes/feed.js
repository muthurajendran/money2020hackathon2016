'use strict';

var geocoder = require('app/v1/middlewares/geocoder');


var object = {
  userFeed: function(req, res, next) {
    geocoder.getLocationName(34.049285,-118.355264).then(function(data) {
      console.log(data);
    })
    .catch(function(err) {
      console.log(err);
    });

    // geocoder.reverse({lat: 34.049285, lon: -118.355264}).then(function(res) {
    //   console.log(res[0].extra.neighborhood);
    // })
    // .catch(function(err) {
    //   console.log(err);
    // });
  }
};

module.exports = object;