'use strict'

var User = require('../models/user');
var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');


router.post('/signup', function(req, res) {
  // create a sample user
  var user = new User({ 
    username: req.body.username,
    email: req.body.email, 
    password: req.body.password 
  });

  // save the sample user
  user.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully');
    res.json({ success: true });
  });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {
	console.log(req.body.username);
  	// find the user
	User.findOne({
		username: req.body.username
	}, function(err, user) {
		if (err) throw err;
		if (!user) {
		  res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			// check if password matches
			user.comparePassword(req.body.password, function(err, isMatch) {
				console.log(isMatch);
        		if (err || !isMatch) {
        			 res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        		} else {
				    // if user is found and password is right
				    // create a token
					var token = jwt.sign(user, 'secret', {
					           expiresIn : 60*60*24
					         });
				    // return the information including token as JSON
				    res.json({
				      success: true,
				      message: 'Enjoy your token!',
				      token: token
				    });
        		}    		
    		});  
		}
	});
});

router.get('/users',function(req, res) {
  User.find(function(err, users) {
    if (err) {
      return res.send(err);
    }
    res.json(users);
  });
});

module.exports = router;