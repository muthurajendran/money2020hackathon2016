'use strict';

var User = require('../models/user');
var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');

/**
 * @api {post} /signup Signup for User
 * @apiName Signup
 * @apiGroup User
 *
 * @apiParam {String} username Users unique ID.
 * @apiParam {String} email Users unique email ID.
 * @apiParam {String} password Users password.
 * @apiParam {Date} dob Users birth date.
 *
 * @apiSuccess {String} success Success message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

router.post('/signup', function(req, res, next) {
    // Create a sample user
    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
    // Save the sample user
    user.save().then(function(data) {
      res.json({
        success: true,
        message: 'User Created',
      });
    })
    .catch(function(err) {
        return next(err);
      });

    //   If (err) {
    //     return next(err);
    //   }
    //   console.log('User saved successfully');
    //   res.json({success: true});
    // });
  });


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {
    console.log(req.body.username);
    // Find the user
    User.findOne({
        username: req.body.username,
      }, function(err, user) {
        if (err) {
          throw err;
        }
        if (!user) {
          res.json({success: false,
              message: 'Authentication failed. User not found.',});
        } else if (user) {
          // Check if password matches
          user.comparePassword(req.body.password, function(err, isMatch) {
              if (err || !isMatch) {
                res.json({success: false,
                    message: 'Authentication failed. Wrong password.',});
              } else {
                // If user is found and password is right
                // create a token
                var token = jwt.sign(user, 'secret', {
                    expiresIn: 60 * 60 * 24,
                  });
                // Return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                  });
              }
            });
        }
      });
  });

router.get('/users', function(req, res) {
    User.find(function(err, users) {
        if (err) {
          return res.send(err);
        }
        res.json(users);
      });
  });

module.exports = router;
