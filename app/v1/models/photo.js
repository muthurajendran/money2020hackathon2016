'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('promise');

var Schema = mongoose.Schema;
// var config = require('server/config/environment');

// var Promise = require('promise');
// var logger = require('logger.js');

var photoSchema = new Schema({
    url: {type: String, required: true},
    userId: {type: String, required: true},

    locationName: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: {type: [Number], default: [0,0] }
    },
  },
  {
    timestamps: true
  });

photoSchema.index({location: '2dsphere'});

module.exports = mongoose.model('Photo', photoSchema);