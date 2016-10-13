'use strict';

var User = require('../models/user');
var ejabberd = require('app/v1/middlewares/ejabberd');
var config = require('server/config/environment');

var object = {

  createUser: function(req, res, next) {
    // Create a new user based on form parameters
    try {
      var user = new User({
        phone: req.body.phone,
        countryCode: req.body.countryCode || '+1',
      });

      User.findOne({phone: user.phone, countryCode: user.countryCode })
      .then(function(userObj) {
        if (userObj) {
          user = userObj;
        }
        return user.sendSMS();
      })
      .then(function(code) {
        user.verifyCode = code;
        return user.save();
      })
      .then(function(data) {
        res.json({
          success: true,
          message: 'User_Created',
          user: data
        });
      })
      .catch(function(err) {
          return next({error: 'ERROR', message: err});
        });
    } catch (err) {
      return next({error: 'ERROR', message: err});
    }
  },

  createUsername: function(req, res, next) {
    try {
      var requestUser = req.user;
      var userName = req.body.username;

      User.findOne({username: userName })
      .then(function(existingUser) {
        // No user found so assign and remove existing jabber account and save
        if (!existingUser) {
          var params = {host: config.ejabberd.userHost, user: requestUser.username};
          requestUser.username = userName;

          return ejabberd.unregister(params)
          .then(function() {
            var params = {host: config.ejabberd.userHost, user: requestUser.username, password: config.ejabberd.userPassword};
            return ejabberd.register(params);
          })
          .then(function() {
            requestUser.jabberId = requestUser.username + '@' + config.ejabberd.userHost;
            return requestUser.save();
          });
        }
        // if found check he has it already
        if (existingUser._id.toString() === requestUser._id.toString()) {
          throw('Already_Owe');
        }
        throw('Username_Not_Available');
      })
      .then(function() {
        res.json({
          success: true,
          user: requestUser
        });
      })
      .catch (function(err) {
        return next({error: 'ERROR', message: err});
      });
    } catch (err) {
      return next({error: 'ERROR', message: err.stack});
    }
  },

  resendPhoneCode: function(req, res, next) {
    try {
      var phoneNum = req.body.phone;
      var countryCode = req.body.countryCode;
      var user = '';

      User.findOne({phone: phoneNum, countryCode: countryCode})
      .then(function(userObj) {
        user = userObj;
        if (!user) {
          throw('User_Not_Found');
        }
        user.countryCode = countryCode || '+1';
        return user.sendSMS();
      })
      .then(function(code) {
        user.verifyCode = code;
        return user.save();
      })
      .then(function(data) {
        res.json({
          success: true,
          user: data
        });
      })
      .catch (function(err) {
        return next({error: 'ERROR', message: err});
      });
    } catch (err) {
      return next({error: 'ERROR', message: err.stack});
    }
  },

  verifyPhoneCode: function(req, res, next) {
    try {
      var userId = req.body.userId;
      var code = req.body.phoneCode;

      User.findById(userId)
      .then(function(user) {
        if (!user) {
          throw('User_Not_Found');
        }
        if (code.toString() !== user.verifyCode.toString()) {
          throw('Verification_Failed');
        }
        user.verified = true;
        return user.createAccessToken();
      })
      .then(function(user) {
        return user.save();
      })
      .then(function(userObj) {
        res.json({
          success: true,
          user: userObj
        });
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err});
      });
    } catch (err) {
      return next({error: 'ERROR', message: err.stack});
    }
  },


  updateUserLocation: function(req, res, next) {
    try {
      var requestUser = req.user;
      
      requestUser.location.coordinates = [req.body.longitude,req.body.latitude];

      requestUser.save()
      .then(function(data) {
        res.json({
          success: true,
          user: data
        });
      })
      .catch(function(err) {
        return next({error: 'ERROR', message: err });
      });

    } catch (err) {
      return next({error: 'ERROR', message: err.stack});
    }
  }

};

module.exports = object;
