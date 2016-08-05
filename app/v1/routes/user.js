'use strict';

var User = require('../models/user');
var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');
var twilio = require('twilio');
var client = twilio('AC5eb64a1951f79369dd938c2f7b9b5ab0','584859b788496c66f1b723b053fd952d')


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
    var user = new User({
      username: req.body.username,
      phone: req.body.phone,
      countryCode: req.body.countryCode || '+1',
    });

    user.save()
    .then(function(data) {
        return user.sendSMS();
    })
    .then(function(code){
        user.verifyCode = code;
        return user.save();
    }).then(function(){
      res.json({
        success: true,
        message: 'User Created',
        user: user
      });
    })
    .catch(function(err) {
        return next(err);
    });
  },

  // router.post('/userUpdate', function(req, res, next){

  // });

  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  // router.post('/authenticate', function(req, res) {
  //     console.log(req.body.username);
  //     // Find the user
  //     User.findOne({
  //         username: req.body.username,
  //       }, function(err, user) {
  //         if (err) {
  //           throw err;
  //         }
  //         if (!user) {
  //           res.json({success: false,
  //               message: 'Authentication failed. User not found.',});
  //         } else if (user) {
  //           // Check if password matches
  //           user.comparePassword(req.body.password, function(err, isMatch) {
  //               if (err || !isMatch) {
  //                 res.json({success: false,
  //                     message: 'Authentication failed. Wrong password.',});
  //               } else {
  //                 // If user is found and password is right
  //                 // create a token
  //                 var token = jwt.sign(user, 'secret', {
  //                     expiresIn: 60 * 60 * 24,
  //                   });
  //                 // Return the information including token as JSON
  //                 res.json({
  //                     success: true,
  //                     message: 'Enjoy your token!',
  //                     token: token,
  //                   });
  //               }
  //             });
  //         }
  //       });
  //   });

  // router.get('/users', function(req, res) {
  //     User.find(function(err, users) {
  //         if (err) {
  //           return res.send(err);
  //         }
  //         res.json(users);
  //       });
  //   });
}

module.exports = object;
