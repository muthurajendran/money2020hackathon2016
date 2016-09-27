'use strict';

var User = require('../models/user');

function auth(req, res, next) {
  var token = req.body.access_token || req.query.access_token || req.headers['x-access-token'];
  if (!token) {
    return res.json({ success: false, message: 'You need token to access this api.'});
  }

  User.findOne({accessToken: token})
  .then(function(user) {
    if (!user) {
      return res.json({ success: false, message: 'Failed to authenticate token.'}); 
    } 
    req.isValid = true;
    req.user = user;
    next();
  });
}

module.exports = auth;