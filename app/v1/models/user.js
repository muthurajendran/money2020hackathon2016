'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('promise');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var config = require('server/config/environment');
var Promise = require('promise');

var twilio = require('twilio');
var client = twilio(config.twilio.accountSid,config.twilio.authToken);

var userSchema = new Schema({
    username: {type: String, required: false, index: {unique: true}},
    // email: {type: String, required: true, index: {unique: true}},
    // password: {type: String, required: true},
    phone: {type: String, required: true},
    verified: {type: Boolean, default: false},
    countryCode: {type: String, required: true},
    authyId: String,
    verifyCode: String,

    createdAt: {type: Date},
    updatedAt: {type: Date},
  });

userSchema.pre('save', function(next) {
    var user = this;
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
      return next();
    }
    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
          return next(err);
        }
        // Hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
              return next(err);
            }
            // Override the cleartext password with the hashed one
            user.password = hash;
            next();
          });
      });
  });

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
          return cb(err);
        }
        cb(null, isMatch);
      });
  };

userSchema.methods.sendSMS = function() {
    return new Promise(function (resolve, reject) {
    var self = this;
    var code = Math.floor((Math.random()*999999)+111111);

    client.sendMessage({
      to: '+12136634643',
      from: '+14242310074',
      body: 'Your security code is: '+code
    }, function(err, message) {
        if (err) {
          reject(err)
        }
        resolve(code);
    });
  });
}

// userSchema.methods.sendAuthyToken = function(cb) {
//   var self = this;
//   if (!self.authyId) {
//     authy.register_user("raju.spm@gmail.com",self.phone, self.countryCode, function(err, response) {
//       if (err || !response.user) {
//         return cb.call(self, err);
//       }
//       self.authyId = response.user.id;
//       self.save(function(err, doc) {
//         if (err || !doc) {
//           return cb.call(self, err);
//         }
//         self = doc;
//         sendToken();
//       });
//     });
//   } else {
//     sendToken();
//   }

//   function sendToken() {
//     authy.request_sms(self.authyId, true, function(err, response) {
//       console.log(response);
//       cb.call(self, err);     
//     });
//   }
// }

// Test a 2FA token
userSchema.methods.verifyAuthyToken = function(otp, cb) {
  var self = this;
  authy.verify(self.authyId, otp, function(err, response) {
    cb.call(self, err, response);
  });
};

// Send a text message via twilio to this user
userSchema.methods.sendMessage = function(message, cb) {
  var self = this;
  twilioClient.sendMessage({
    to: self.countryCode + self.phone,
    from: config.twilio.phoneNumber,
    body: message
  }, function(err, response) {
    cb.call(self, err);
  });
};

module.exports = mongoose.model('User', userSchema);
