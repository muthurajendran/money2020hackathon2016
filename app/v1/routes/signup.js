'use strict';

var User = require('app/v1/models/user');
var express = require('express');
var router = express.Router();

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

module.exports = router;