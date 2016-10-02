'use strict';

var NodeGeocoder = require('node-geocoder');
var config = require('server/config/environment');
var geocoder = NodeGeocoder(config.geocoder);
var Promise = require('promise');

module.exports = {	
  getLocationName: function(latitude, longitude) {
    return new Promise(function(resolve, reject) {
      geocoder.reverse({lat: latitude, lon: longitude}).then(function(res) {
        if (res[0].extra.neighborhood) {
          console.log(res);
          resolve(res[0].extra.neighborhood);
        } else {
          resolve(res[0].city);
        }
      })
      .catch(function(err) {
        reject(err);
      });
    });
  }
};