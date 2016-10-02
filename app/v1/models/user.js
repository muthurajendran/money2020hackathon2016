'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('promise');
var Schema = mongoose.Schema;
var config = require('server/config/environment');
var Promise = require('promise');
var logger = require('logger.js');
var uuid = require('node-uuid');

var twilio = require('twilio');
var client = twilio(config.twilio.accountSid,config.twilio.authToken);

var userSchema = new Schema({
    username: {type: String, required: false, unique: true, sparse: true},
    phone: {type: String, required: true},
    verified: {type: Boolean, default: false},
    countryCode: {type: String, required: true},
    chatroomId: {type: Schema.Types.ObjectId, ref: 'Chatroom'},
    accessToken: String,
    deviceToken: String,
    verifyCode: String,
    jabberId: String,
    locationName: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: {type: [Number], default: [0,0] }
    },
  },
  {
    timestamps: true
  });

userSchema.index({location: '2dsphere'});

userSchema.methods.sendSMS = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      var code = Math.floor((Math.random() * 999999) + 111111);

      client.sendMessage({
        to: self.countryCode + self.phone,
        from: config.twilio.phoneNumber,
        body: 'Your security code for Pinguin is: ' + code
      }, function(err, message) {
        if (err) {
          logger.error(message);
          reject(err);
        }
        resolve(code);
      });
    });
  };

userSchema.methods.createAccessToken = function() {
  var self = this;
  return new Promise(function(resolve) {
    self.accessToken = uuid.v4();
    resolve(self);
  });
};

module.exports = mongoose.model('User', userSchema);
