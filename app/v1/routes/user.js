var User = require('../models/user');
var express = require('express');
var router = express.Router();

router.get('/users',function(req, res) {
  User.find(function(err, users) {
    if (err) {
      return res.send(err);
    }
    res.json(users);
  });
});

