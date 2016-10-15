'use strict';

// var NodeGeocoder = require('node-geocoder');
var config = require('server/config/environment');
// var geocoder = NodeGeocoder(config.geocoder);
var googleMapsClient = require('@google/maps').createClient({
  key: config.geocoder.apiKey
});

var Promise = require('promise');

function processdata(data) {
  console.log(data);
  return new Promise(function(resolve) {
    var results = {
      neighborhood: [],
      sublocality: [],
      city: []
    };

    for (var i = 0; i < data.length; i++) {
      var components = data[i].address_components;
      
      for (var j = 0; j < components.length; j++) {
        var component = components[j];
        
        if (component.types.indexOf('neighborhood') !== -1) {
          results.neighborhood.push(component.long_name);
        }
        
        if (component.types.indexOf('locality') !== -1) {
          results.city.push(component.long_name);
        }
        if (component.types.indexOf('sublocality') !== -1) {
          results.city.push(component.long_name);
        }
      }
    }

    if (i === data.length) {
      resolve(results);
    }
  });
}

module.exports = {	
  getLocationName: function(latitude, longitude) {
    console.log(latitude,longitude);
    return new Promise(function(resolve, reject) {
      googleMapsClient.reverseGeocode({
        latlng: [latitude, longitude],
        location_type: ['APPROXIMATE'],
        result_type: ['neighborhood','sublocality'],
      }, function(err, response) {
        console.log(response.json.results);
        if (!err) {
          return processdata(response.json.results)
          .then(function(results) {
            if (results.neighborhood.length >= 1) {
              resolve(results.neighborhood[0]);
            } else if (results.sublocality.length >= 1) {
              resolve(results.sublocality[0]);
            } else {
              resolve(results.city[0]);
            }
          });
        }
        reject(err);
      });
      // googleMapsClient.reverseGeocode({
      //   latlng: [latitude,longitude],
      // }, function(err, response) {
      //   if (!err) {
      //     console,log(response.json.results);
      //     resolve(response.json.results);
      //   } else {
      //     reject(err)
      //   }
      // });
      // geocoder.reverse({lat: latitude, lon: longitude, zoom: '18', addressdetails: '1'}).then(function(res) {
      //   resolve(res);
      //   // if (res[0].extra.neighborhood) {
      //   //   console.log(res);

      //   //   // resolve(res[0].extra.neighborhood);
      //   // } else {
      //   //   resolve(res[0].city);
      //   // }
      // })
      // .catch(function(err) {
      //   reject(err);
      // });
    });
  }
};