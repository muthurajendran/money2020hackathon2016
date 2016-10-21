'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('promise');

var Schema = mongoose.Schema;

var photoSchema = new Schema({
    url: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},

    locationName: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: {type: [Number], default: [0,0] }
    },
    photo_type: String,
    reactions: {
      thumbsUp: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
      sad: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
      lol: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
      heart: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
      surprise: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
      angry: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }]
    }
  },
  {
    timestamps: true
  });

photoSchema.index({location: '2dsphere'});

module.exports = mongoose.model('Photo', photoSchema);