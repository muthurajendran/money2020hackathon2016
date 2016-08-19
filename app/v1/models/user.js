'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('promise');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
// var SALT_WORK_FACTOR = 10;
var config = require('server/config/environment');
var Promise = require('promise');
var logger = require('logger.js');

var twilio = require('twilio');
var client = twilio(config.twilio.accountSid,config.twilio.authToken);

var userSchema = new Schema({
    username: {type: String, required: false, unique: true, sparse: true},
    phone: {type: String, required: true},
    verified: {type: Boolean, default: false},
    countryCode: {type: String, required: true},
    accessToken: String,
    deviceToken: String,
    verifyCode: String,
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

// userSchema.pre('save', function(next) {
//     var user = this;
//     // Only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) {
//       return next();
//     }
//     // Generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) {
//           return next(err);
//         }
//         // Hash the password using our new salt
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) {
//               return next(err);
//             }
//             // Override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//           });
//       });
//   });

// userSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) {
//           return cb(err);
//         }
//         cb(null, isMatch);
//       });
//   };



module.exports = mongoose.model('User', userSchema);
