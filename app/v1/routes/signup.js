'use strict';

var User = require('app/v1/models/user');
var express = require('express');
var router = express.Router();
var twilio = require('twilio');

var client = twilio('AC5eb64a1951f79369dd938c2f7b9b5ab0','584859b788496c66f1b723b053fd952d')

router.post('/verifyPhone', function(req, res, next) {
  var code = Math.floor((Math.random()*999999)+111111);

  client.sendMessage({
    to: '+12136634643',
    from: '+14242310074',
    body: 'Your security code is: '+code
  }, function(err, message) {
      if (err) {
        console.error('Text failed because: ' + err.message);
      } else {
        res.json({
          success: true,
          message: 'User Created',
        });
      }
    });
})

// create a new user based on the form submission
router.post('/createuser', function(req, res, next) {
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
});

module.exports = router;