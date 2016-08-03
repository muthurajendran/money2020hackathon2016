'use strict';

var User = require('../models/user');
var express = require('express');
var router = express.Router();
var authy = require('authy')('f45ec9af9dcb7419dc52b05889c858e9', 'http://sandbox-api.authy.com');

router.post('/verifyPhone', function(req, res, next) {
  return authy.register_user('n@c.com','213-663-4643', function(err, res) {
    if (err) {
      next(err);
    }
    console.log(res);
  });
})

module.exports = router;