'use strict';

var User = require('../models/user');

var object = {
  /**
   * @api {post} /createUser Verification for User
   * @apiName VerifyPhone
   * @apiGroup User
   *
   * @apiParam {String} username Users unique ID.
   * @apiParam {String} phone Users phone number.
   * @apiParam {String} countryCode Users country - default +1.
   *
   * @apiSuccess {String} success Success message
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *         "success": true,
   *         "message": "User Created",
   *         "user": {
   *           "verifyCode": "825143",
   *           "__v": 0,
   *           "username": "mrii",
   *           "phone": "2136634643",
   *           "countryCode": "+1",
   *           "_id": "57a2c9aec58e5c1100cfa64c",
   *           "verified": false
   *         }
   *      }
   *
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": "UserNotFound"
   *     }
   */
  createUser: function(req, res, next) {
    // Create a new user based on form parameters
    try {
      var user = new User({
        phone: req.body.phone,
        countryCode: req.body.countryCode || '+1',
      });

      user.save()
      .then(function(user) {
        console.log(user);
        return user.sendSMS();
      })
      .then(function(code) {
        user.verifyCode = code;
        return user.save();
      })
      .then(function(data) {
        res.json({
          success: true,
          message: 'User Created',
          user: data
        });
      })
      .catch(function(err) {
          return next(err);
        });
    } catch (err) {
      return next(err);
    }
  },

  createUsername: function(req, res, next) {
    try {
      var userId = req.body.userId;
      var userName = req.body.username;

      User.findOne({username: userName })
      .then(function(user) {
        if (!user) {
          return User.findById(userId);
        }
        if (user._id.toString() === userId.toString()) {
          throw('Already_Owe');
        }
        throw('Username_Not_Available');
      })
      .then(function(user) {
        if (!user) {
          throw('User_Not_Found');
        }
        user.username = userName;
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
      return next({error: 'ERROR', message: err});
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
      return next({error: 'ERROR', message: err});
    }
  }

};

module.exports = object;
