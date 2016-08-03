'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('Promise');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},

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

module.exports = mongoose.model('User', userSchema);
