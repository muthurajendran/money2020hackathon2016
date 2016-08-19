var express = require('express');
var router = express.Router();

var user = require('./user.js');
var photo = require('./photo.js');

// User activity api's
router.post('/createUser', user.createUser);
router.post('/createUsername', user.createUsername);
router.post('/verifyPhoneCode', user.verifyPhoneCode);
router.post('/resendPhoneCode', user.resendPhoneCode);
router.post('/updateUserLocation',user.updateUserLocation);

// Photo activity api's
router.post('/uploadPhoto',photo.uploadPhoto);

module.exports = router;